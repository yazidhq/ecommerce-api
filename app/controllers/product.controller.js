const product = require("../db/models/product");
const user = require("../db/models/user");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async.");

const createData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;

  const create = await product.create({
    ...data,
    createdBy: userId,
  });

  if (!create) {
    return next(new AppError("Failed to create the product"), 400);
  }

  return res.status(201).json({
    status: "success",
    data: create,
  });
});

const getsData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const result = await product.findAll({
    include: { model: user, attributes: ["firstName", "lastName", "email"] },
    where: { createdBy: userId },
  });

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const getData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const result = await product.findOne({
    include: { model: user, attributes: ["firstName", "lastName", "email"] },
    where: {
      id: productId,
      createdBy: userId,
    },
  });

  if (!result) {
    return next(new AppError("Invalid product id", 400));
  }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;
  const productId = req.params.id;

  const getProduct = await product.findOne({
    where: {
      id: productId,
      createdBy: userId,
    },
  });

  if (!getProduct) {
    return next(new AppError("Invalid product id", 400));
  }

  const update = await getProduct.update({
    ...data,
    createdBy: userId,
  });

  if (!update) {
    return next(new AppError("Failed update the product", 400));
  }

  return res.status(200).json({
    status: "success",
    data: update,
  });
});

const truncateData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const truncate = await product.destroy({
    where: {
      createdBy: userId,
    },
    force: true,
  });

  if (!truncate) {
    return next(new AppError("Failed truncate the product", 400));
  }

  return res.status(200).json({
    status: "success",
    data: "Data truncated successfully",
  });
});

const deleteData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const getProduct = await product.findOne({
    where: {
      id: productId,
      createdBy: userId,
    },
  });

  if (!getProduct) {
    return next(new AppError("Invalid product id", 400));
  }

  const destroy = getProduct.destroy();

  if (!destroy) {
    return next(new AppError("Failed delete the product", 400));
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
