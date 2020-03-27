const multer = require('multer');

//Upload images to disk Storage using multer MiddleWare
var uploadFiles = (dir) => {
    var storage = multer.diskStorage({
        destination:function(req,file,cb){
             cb(null,dir)
        },
        filename:function(req,file,cb){
             cb(null, file.originalname)
        }
    })
    var upload = multer({storage:storage})
    return upload;
}

module.exports = {uploadFiles}
