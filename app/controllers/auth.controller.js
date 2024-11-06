const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catch.async.");
const AppError = require("../utils/app.error");

const generateToken = (payload) => {
  const header = {
    alg: process.env.JWT_ALGORITHM,
    typ: process.env.JWT_TYPE,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    header: header,
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!["1", "2"].includes(data.userType)) {
    return next(new AppError("Invalid user type"), 400);
  }

  const create = await user.create({
    userType: data.userType,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  if (!create) {
    return next(new AppError("Failed to create the user"), 400);
  }

  const result = create.toJSON();
  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
    userType: result.userType,
  });

  return res.status(201).json({
    status: "success",
    data: result,
  });
});

const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password"), 401);
  }

  const result = await user.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Incorrect email or password"), 401);
  }

  const token = generateToken({
    id: result.id,
    userType: result.userType,
  });

  return res.status(200).json({
    status: "success",
    token: token,
  });
});

module.exports = { signUp, signIn };
