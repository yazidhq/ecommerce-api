const category = require("../db/models/category");
const user = require("../db/models/user");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async.");

const createData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;

  const create = await category.create({
    name: data.name,
    createdBy: userId,
  });

  if (!create) {
    return next(new AppError("Failed to create the category"), 400);
  }

  return res.status(201).json({
    status: "success",
    data: create,
  });
});

const getsData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const result = await category.findAll({
    include: { model: user, attributes: ["firstName", "lastName", "email"] },
    where: {
      createdBy: userId,
    },
  });

  return res.json({
    status: "success",
    data: result,
  });
});

const getData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.id;

  const result = await category.findOne({
    include: { model: user, attributes: ["firstName", "lastName", "email"] },
    where: {
      id: categoryId,
      createdBy: userId,
    },
  });

  if (!result) {
    return next(new AppError("Invalid category id", 400));
  }

  return res.json({
    status: "success",
    data: result,
  });
});

const updateData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;
  const categoryId = req.params.id;
  const getCategory = await category.findOne({
    where: {
      id: categoryId,
      createdBy: userId,
    },
  });

  if (!getCategory) {
    return next(new AppError("Invalid category id", 400));
  }

  const update = await getCategory.update({
    name: data.name,
    createdBy: userId,
  });

  if (!update) {
    return next(new AppError("Failed update the category", 400));
  }

  return res.status(201).json({
    status: "success",
    data: update,
  });
});

const truncateData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const truncate = await category.destroy({
    where: {
      createdBy: userId,
    },
    force: true,
  });

  if (!truncate) {
    return next(new AppError("Failed truncate the category", 400));
  }

  return res.status(201).json({
    status: "success",
    data: "Data truncated successfully",
  });
});

const deleteData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  const getCategory = await category.findOne({
    where: {
      id: categoryId,
      createdBy: userId,
    },
  });

  if (!getCategory) {
    return next(new AppError("Invalid category id", 400));
  }

  const destroy = getCategory.destroy();

  if (!destroy) {
    return next(new AppError("Failed delete the category", 400));
  }

  return res.status(201).json({
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
