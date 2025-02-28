import * as multer from 'multer';

export const multerConfig = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        },
    })
    ,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    }
    ,
    limits: { fileSize: 1024 * 1024 * 5 }
}