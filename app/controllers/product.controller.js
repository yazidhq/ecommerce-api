const category = require("../db/models/category");
const product = require("../db/models/product");
const productcategory = require("../db/models/productcategory");
const user = require("../db/models/user");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async.");

const createData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;

  const { categoryIds, ...productData } = data;

  const create = await product.create({
    ...productData,
    createdBy: userId,
  });

  if (!create) {
    return next(new AppError("Failed to create the product"), 400);
  }

  if (categoryIds) {
    const validCategories = await category.findAll({
      where: {
        id: categoryIds,
      },
    });

    if (validCategories.length !== categoryIds.length) {
      return next(new AppError("Some category id are invalid"), 400);
    }

    for (let category of validCategories) {
      await productcategory.create({
        productId: create.id,
        categoryId: category.id,
      });
    }
  }

  return res.status(201).json({
    status: "success",
    data: create,
  });
});

const getsData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const result = await product.findAll({
    include: [
      { model: user, attributes: ["firstName", "lastName", "email"] },
      {
        model: productcategory,
        attributes: ["categoryId"],
        include: [{ model: category, attributes: ["name"] }],
      },
    ],
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
    include: [
      { model: user, attributes: ["firstName", "lastName", "email"] },
      {
        model: productcategory,
        attributes: ["categoryId"],
        include: [{ model: category, attributes: ["name"] }],
      },
    ],
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

  const { categoryIds, ...productData } = data;

  const update = await getProduct.update({
    ...productData,
    createdBy: userId,
  });

  if (!update) {
    return next(new AppError("Failed update the product", 400));
  }

  if (categoryIds) {
    const validCategories = await category.findAll({
      where: {
        id: categoryIds,
      },
    });

    if (validCategories.length !== categoryIds.length) {
      return next(new AppError("Some category id are invalid"), 400);
    }

    const existCategory = await productcategory.findAll({
      where: {
        productId: update.id,
      },
    });

    if (existCategory.length !== 0) {
      const destroyCategory = await productcategory.destroy({
        where: {
          productId: update.id,
        },
      });

      if (!destroyCategory) {
        return next(new AppError("Failed delete the product categories", 400));
      }
    }

    for (let category of validCategories) {
      await productcategory.create({
        productId: update.id,
        categoryId: category.id,
      });
    }
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

  const existCategory = await productcategory.findAll({
    where: {
      productId: productId,
    },
  });

  if (existCategory.length !== 0) {
    const destroyCategory = await productcategory.destroy({
      where: {
        productId: productId,
      },
    });

    if (!destroyCategory) {
      return next(new AppError("Failed delete the product categories", 400));
    }
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
