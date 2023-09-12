
// ------------ Multer -------------------------------

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null, "uploads");
    },
    filename: function(req, file, cb){
        return cb(null,`${Date.now()}-${file.originalname}`);
    },
});



const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
  
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: You can Only Upload Images!!");
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
