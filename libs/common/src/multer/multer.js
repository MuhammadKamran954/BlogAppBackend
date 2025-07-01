const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDirectory = path.resolve(__dirname,'./../uploads');

if(!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory,{recursive:true});
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,uploadDirectory);
    },
    filename: (req,file,cb) =>{
        if(!file.originalname){
            return cb(new Error('Invalid file: No file name provided'),null);
    }
    const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
    cb(null,`profile_${uniqueSuffix}`);
    }
});

const fileFilter = (req,file,cb)=>{
    if(!file){return cb(new Error('No file uploaded'),false);
    }
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error("Only image files are allowed"),false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
