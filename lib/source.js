class FileSource {
  constructor(file) {
    this._file = file;
    this.size = file.size;
  }

  slice(start, end) {
    return this._file.slice(start, end);
  }

  close() {}
}

export function getSource(input) {
  if (typeof input.slice === "function" && typeof input.size !== "undefined") {
    return new FileSource(input);
  }

  throw new Error("source object may only be an instance of File or Blob in this environment");
}