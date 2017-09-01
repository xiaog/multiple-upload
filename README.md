# multiple-upload
A pure JavaScript client for upyun server multiple upload，inspired by [tus](http://tus.io)

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

## Installation

The sources are compiled into [UMD](https://github.com/umdjs/umd)
(`dist/multiple.js`) which can be loaded using different approaches:
* **Embed using a script tag:** `<script src="dist/multiple.js"></script>` and access
* **Install from NPM:** `npm install git@github.com:xiaog/multiple-upload.git --save`:
`var multiple = require("multiple")`
* **Define using AMD:** `define("alpha", ["dist/multiple.js"], function(multiple) {})`

## Explanation

The project just supported upyun resume for break point when upload large files 
and just supported [upyun upload protocol](http://docs.upyun.com/api/rest_api/#_3)

## Base Usage

## Feature

* Support resume chunk when network occur error
* Support node's environment