import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (file.fieldname === "profileImage") {
      uploadPath = "./public/profiles";
    } else if (file.fieldname === "productImage") {
      uploadPath = "./public/products";
    } else {
      uploadPath = "./public/documents";
    }

    fs.access(uploadPath, (err) => {
      if (err) {
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creando la carpeta:", err);
            cb(err, null);
          } else {
            cb(null, uploadPath);
          }
        });
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
