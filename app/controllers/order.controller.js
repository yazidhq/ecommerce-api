const order = require("../db/models/order");
const user = require("../db/models/user");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async");

const createData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;

  const { ...orderData } = data;

  const create = await order.create({
    ...orderData,
    userId: userId,
  });

  if (create) {
    return res.status(201).json({
      status: "success",
      data: create,
    });
  } else {
    return next(new AppError("Failed to create the order"), 400);
  }
});

const getsData = catchAsync(async (req, res, next) => {
  const result = await order.findAll({
    include: [{ model: user, attributes: ["firstName", "lastName", "email"] }],
  });

  if (result) {
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } else {
    return next(new AppError("Failed to find the order"), 400);
  }
});

const getData = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  const result = await order.findOne({
    include: [{ model: user, attributes: ["firstName", "lastName", "email"] }],
    where: {
      id: orderId,
    },
  });

  if (result) {
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } else {
    return next(new AppError("Invalid order id", 400));
  }
});

const updateData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;
  const orderId = req.params.id;

  const { ...orderData } = data;

  const getOrder = await order.findOne({
    where: {
      id: orderId,
      userId: userId,
    },
  });

  update = await getOrder.update({
    ...orderData,
  });

  if (update) {
    return res.status(200).json({
      status: "success",
      data: update,
    });
  } else {
    return next(new AppError("Invalid order id", 400));
  }
});

const truncateData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const truncate = await order.destroy({
    where: {
      userId: userId,
    },
  });

  if (truncate) {
    return res.status(200).json({
      status: "success",
      data: "Data truncated successfully",
    });
  } else {
    return next(new AppError("Failed to truncate the orders", 400));
  }
});

const deleteData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const destroyOrder = await order.destroy({
    where: {
      id: orderId,
      userId: userId,
    },
  });

  if (destroyOrder) {
    return res.status(200).json({
      status: "success",
      data: "Data deleted successfully",
    });
  } else {
    return next(new AppError("Failed to delete the order", 400));
  }
});

module.exports = {
  createData,
  getsData,
  getData,
  updateData,
  truncateData,
  deleteData,
};
