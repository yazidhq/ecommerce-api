const jwt = require("jsonwebtoken");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async.");
const user = require("../db/models/user");

const authentication = catchAsync(async (req, res, next) => {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please login to access", 401));
  }

  const tokenDetail = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const userData = await user.findByPk(tokenDetail.id);

  if (!userData) {
    return next(new AppError("User no longer exists", 400));
  }

  req.user = userData;

  return next();
});

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    return next();
  };

  return checkPermission;
};

module.exports = { authentication, restrictTo };
