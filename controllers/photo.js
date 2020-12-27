var stream = require("stream");
const multer = require("multer");
const fs = require("fs");
const { Photo } = require("../squelize");

var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "/uploads/images");
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).array("image", 3); //Field name and max count

exports.uploadImage = (req, res, next) => {
  console.log("filename: ", req.body); // the uploaded file object
  photo = req.files[0].path;
  upload(req, res, function(err) {
    if (err) {
      return res.end("Something went wrong!");
    }
    var photoBody = req.body;
    photoBody.photo = photo;
    var etabId = req.params.etabId;
    photoBody.etablissmentderestaurationId = etabId;
    Photo.create(photoBody).then(result => {
      res.status(201).json(result);
    });
  });
};

exports.getImages = (req, res, next) => {
  let etabId = req.params.id;
  Photo.findAll({
      where:{
        etablissmentderestaurationId: etabId
      }
  }).then(photos => {
      console.log(photos.length)
    var readFileAsync = function(filename) {
        return new Promise(function(resolve, reject) {
            fs.readFile(filename, "base64", function(err, data){
                if (err) 
                    reject(err); 
                else 
                    resolve(data);
            });
        });
    };

    var getImage =  function getImage(index) {
        var imgPath = "./" + index;
        return readFileAsync(imgPath);
    }

    function getAllImages(lesImages) {
        var n = lesImages.length;
        if (n > 3) n = 3;    
        var promises = [];
        // load all images in parallel
        for (var i = 0; i < n; i++) {
            console.log(lesImages[i].photo);
            promises.push(getImage(lesImages[i].photo));
        }
        // return promise that is resolved when all images are done loading
        return Promise.all(promises);
     }

    getAllImages(photos).then( result => {
        data_uri = result.map( elt =>  `data:image/jpeg;base64, ${elt}`);
        res.status(200).json(data_uri);
    });
  });
}

    
