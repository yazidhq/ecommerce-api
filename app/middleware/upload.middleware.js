const multer = require("multer");
const AppError = require("../utils/app.error");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/upload/products");
  },

  filename: (req, file, callback) => {
    callback(null, `${Date.now()} - ${file.originalname}`);
  },
});

const filter = (req, file, callback) => {
  const fileTypes = /jpeg|jpg|png|JPEG|JPG|PNG/;

  if (!file.originalname.match(fileTypes)) {
    return callback(
      new AppError("Require extension: JPEG, JPG, PNG", 400),
      false
    );
  }

  callback(null, true);
};

const protocol = (req, res, next) => {
  baseProtocol = `${req.protocol}://${req.get("host")}`;
  return next();
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
  limits: 5000000,
});

module.exports = { upload, protocol };
