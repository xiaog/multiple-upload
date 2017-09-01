# multiple-upload
A pure JavaScript client for upyun server multiple upload

## Example

```js
var options = {
  endpoint: 'http://api.server.com/show/',
  chunkSize: 1048576,
  headers: {
    Authorization: 'token'
  },
  onError: function(error) {
    console.log("Failed because: " + error)
  },
  onProgress: function(bytesUploaded, bytesTotal) {
    var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
    console.log(bytesUploaded, bytesTotal, percentage + "%")
  },
  onSuccess: function() {
    console.log("Download %s from %s", upload.file.name, upload.url)
  },
  onCompletePostData: {
    name: 'test',
    description: 'description'
  }
};
var file = document.getElementById('file').files[0];
var upload = new multiple.Upload(file, options);

upload.start();
```
