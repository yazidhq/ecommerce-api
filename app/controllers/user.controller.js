const { Op } = require("sequelize");
const user = require("../db/models/user");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async");

const createData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const create = await user.create({
    ...data,
  });

  if (!create) {
    return next(new AppError("Failed to create the user"), 400);
  }

  return res.status(201).json({
    status: "success",
    data: create,
  });
});

const getsData = catchAsync(async (req, res, next) => {
  const result = await user.findAll();

  if (!result) {
    return next(new AppError("Failed to get users"), 400);
  }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const getData = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const result = await user.findAll({
    where: {
      id: userId,
    },
  });

  if (!result) {
    return next(new AppError("Invalid user id", 400));
  }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.params.id;

  const getUser = await user.findOne({
    where: {
      id: userId,
    },
  });

  if (!getUser) {
    return next(new AppError("Invalid user id", 400));
  }

  const update = await getUser.update({
    ...data,
  });

  if (!update) {
    return next(new AppError("Failed update the user", 400));
  }

  return res.status(200).json({
    status: "success",
    data: update,
  });
});

const truncateData = catchAsync(async (req, res, next) => {
  const truncate = await user.destroy({
    where: {
      userType: { [Op.ne]: "0" },
    },
  });

  if (!truncate) {
    return next(new AppError("Failed truncate the user", 400));
  }

  return res.status(200).json({
    status: "success",
    data: "Data truncated successfully",
  });
});

const deleteData = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const getUser = await user.findOne({
    where: {
      id: userId,
      userType: { [Op.ne]: "0" },
    },
  });

  if (!getUser) {
    return next(new AppError("Invalid user id", 400));
  }

  const destroy = getUser.destroy();

  if (!destroy) {
    return next(new AppError("Failed delete the user", 400));
  }

  return res.status(200).json({
    status: "success",
    data: "Data deleted successfully",
  });
});

module.exports = {
  createData,
  getsData,
  getData,
  updateData,
  truncateData,
  deleteData,
};
