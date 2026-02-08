const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
    const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed"), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload
};

exports.uploadSingleImage = (fileName) => {
  const upload = multerOptions();
  return upload.single(fileName);
};

exports.uploadMixOfImages = (arrOfFields) => {
  const upload = multerOptions();

  return upload.fields(arrOfFields);
};

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDirectory);
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `category-${crypto.randomUUID()}-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });
