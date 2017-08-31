
import {getSource} from './lib/source';
import {getFilename} from './lib/getFilename';

const newRequest = () => {
  return new window.XMLHttpRequest();
}

const defaultOptions = {
  endpoint: "",
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  headers: {},
  chunkSize: Infinity,
  withCredentials: false,
  uploadUrl: null,
  uploadSize: null,
  overridePatchMethod: false,
  retryDelays: null
};

class Upload {
  constructor(file, options) { 
    this.options = extend(true, {}, defaultOptions, options);

    // The underlying File/Blob object
    this.file = file;

    // The URL against which the file will be uploaded
    this.url = null;

    // The underlying XHR object for the current PUT request
    this._xhr = null;

    // The offset used in the current PUT request
    this._offset = null;

    // True if the current PUT request has been aborted
    this._aborted = false;

    // The file's size in bytes
    this._size = null;

    // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.
    this._source = null;

    // The current count of attempts which have been made. Null indicates none.
    this._retryAttempt = 0;

    // The timeout's ID which is used to delay the next retry
    this._retryTimeout = null;

    // The offset of the remote upload before the latest attempt was started.
    this._offsetBeforeRetry = 0;

    // The uuid is upyun return id for multiple upload
    this._uuid = null;
  }
  _emitXhrError(xhr, err, causingErr) {
    this._emitError(new DetailedError(err, causingErr, xhr));
  }

  _emitError(err) {
    if (typeof this.options.onError === "function") {
      this.options.onError(err);
    } else {
      throw err;
    }
  }

  _emitSuccess() {
    if (typeof this.options.onSuccess === "function") {
      this.options.onSuccess();
    }
  }

  _setupXHR(xhr) {
    let headers = this.options.headers;

    for (let name in headers) {
      xhr.setRequestHeader(name, headers[name]);
    }

    // xhr.withCredentials = this.options.withCredentials;
  }


  start () {
    let file = this.file;
    if (!file) {
      this._emitError(new Error("no file to upload provided"));
      return;
    }

    if (!this.options.endpoint) {
        this._emitError(new Error("no endpoint provided"));
        return;
    }
    let ext = '.' + file.name.split('.').pop();
    this.url = this.options.endpoint + getFilename() + ext;

    let source = this._source = getSource(file, this.options.chunkSize);
    let size = source.size;
    this._size = size;
    let xhr = newRequest();
    xhr.open("PUT", this.url, true);

    xhr.onload = (e) => {
      if (!(xhr.status >= 200 && xhr.status < 300)) {
        this._emitXhrError(xhr, new Error("unexpected response while creating upload"));
        return;
      }
      let nextId = Number(e.currentTarget.getResponseHeader('x-upyun-next-part-id'));
      this._uuid = e.currentTarget.getResponseHeader('x-upyun-multi-uuid');
      this._offset = 0;
      this._startUpload(nextId);
    };

    xhr.onerror = (err) => {
      this._emitXhrError(xhr, new Error("failed to create upload"), err);
    };

    this._setupXHR(xhr);
    xhr.setRequestHeader("X-Upyun-Multi-Stage", "initiate");
    xhr.setRequestHeader("X-Upyun-Multi-Length", size);

    xhr.send(null);
  }
  
  _startUpload (nextId) {
    if (this._aborted) {
      return;
    }

    let xhr = this._xhr = newRequest();

    xhr.open("PUT", this.url, true);

    xhr.onload = (e) => {
      if (!(xhr.status >= 200 && xhr.status < 300)) {
        this._emitXhrError(xhr, new Error("unexpected response while uploading chunk"));
        return;
      }
      let nextId = Number(e.currentTarget.getResponseHeader('x-upyun-next-part-id'));
      let offset = parseInt(nextId * this.options.chunkSize, 10);
      if (isNaN(offset)) {
        this._emitXhrError(xhr, new Error("invalid or missing offset value"));
        return;
      }

      this._emitProgress(offset, this._size);
      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (nextId === -1) return this._complete();
      this._startUpload(nextId);
    };

    xhr.onerror = (err) => {
      // Don't emit an error if the upload was aborted manually
      if (this._aborted) {
        return;
      }

      this._emitXhrError(xhr, new Error("failed to upload chunk at offset " + this._offset), err);
    };

    this._setupXHR(xhr);

    xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
    xhr.setRequestHeader("x-upyun-multi-uuid", this._uuid);
    xhr.setRequestHeader("x-upyun-part-id", String(nextId));
    xhr.setRequestHeader("X-Upyun-Multi-Stage", "upload");
    let start = this._offset;
    let end = this._offset + this.options.chunkSize;

    // The specified chunkSize may be Infinity or the calcluated end position
    // may exceed the file's size. In both cases, we limit the end position to
    // the input's total size for simpler calculations and correctness.
    if (end === Infinity || end > this._size) {
      end = this._size;
    }

    xhr.send(this._source.slice(start, end));
  }

  _complete () {
    // If the upload has been aborted, we will not send the next PATCH request.
    // This is important if the abort method was called during a callback, such
    // as onChunkComplete or onProgress.
    if (this._aborted) {
      return;
    }

    let xhr = this._xhr = newRequest();

    xhr.open("PUT", this.url, true);

    xhr.onload = () => {
      if (!(xhr.status >= 200 && xhr.status < 300)) {
        this._emitXhrError(xhr, new Error("unexpected response while uploading chunk"));
        return;
      }

      let offset = this._offset;
      if (isNaN(offset)) {
        this._emitXhrError(xhr, new Error("invalid or missing offset value"));
        return;
      }

      this._emitProgress(offset, this._size);
      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (offset == this._size) {
        // Yay, finally done :)
        this._emitSuccess();
        this._source.close();
        return;
      }
    };

    xhr.onerror = (err) => {
      // Don't emit an error if the upload was aborted manually
      if (this._aborted) {
        return;
      }

      this._emitXhrError(xhr, new Error("failed to upload chunk at offset " + this._offset), err);
    };

    this._setupXHR(xhr);

    xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
    xhr.setRequestHeader("X-Upyun-Multi-Stage", "complete");
    xhr.setRequestHeader("x-upyun-multi-uuid", this._uuid);

    xhr.send(null);
  }
}

Upload.defaultOptions = defaultOptions;

export default Upload;