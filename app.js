const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/router').router;
var multer, storage, path, crypto,mimeTypes,mimeType ;
multer = require('multer')
path = require('path');
crypto = require('crypto');
var fs = require('fs');
mimeTypes = {
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/PNG",
    "pdf": "application/pdf"
  };

var form = "<!DOCTYPE HTML><html><body>" +
"<form method='post' action='/upload' enctype='multipart/form-data'>" +
"<input type='file' name='upload'/>" +
"<input type='submit' /></form>" +
"</body></html>";

app.get('/', function (req, res){
    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(form);
  
  });
  
  // Include the node file module
  var fs = require('fs');
  
  storage = multer.diskStorage({
      destination: './uploads/',
      filename: function(req, file, cb) {
        return crypto.pseudoRandomBytes(16, function(err, raw) {
          if (err) {
            return cb(err);
          }
          return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
        });
      }
    });
  
  
  // Post files
  app.post(
    "/upload",
    multer({
      storage: storage
    }).single('upload'), function(req, res) {
      console.log(req.file);
      console.log(req.body);
      res.redirect("/uploads/" + req.file.filename);
      console.log(req.file.filename);
        mimeType = mimeTypes[req.file.filename.split('.').pop()];

      return res.status(200).end();
    });
  
  app.get('/uploads/:upload', function (req, res){
    file = req.params.upload;
    console.log(req.params.upload);
    var img = fs.readFileSync(__dirname + "/uploads/" + file);
    res.writeHead(200, {'Content-Type': mimeType });
    res.end(img, 'binary');
  
  });
  
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use the prefixe frienGo router
app.use('/', apiRouter);

//error request

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;