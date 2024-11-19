const category = require("../db/models/category");
const product = require("../db/models/product");
const productcategory = require("../db/models/productcategory");
const user = require("../db/models/user");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catch.async.");
const { deleteOldFiles } = require("./helper.controller");

const createData = catchAsync(async (req, res, next) => {
  const data = req.body;
  const userId = req.user.id;

  const { categoryIds, ...productData } = data;

  const validCategories = await category.findAll({
    where: {
      id: categoryIds,
    },
    attributes: ["id", "name"],
  });

  if (validCategories.length !== categoryIds.length) {
    return next(new AppError("Some category id are invalid"), 400);
  }

  const imagePaths = req.files.map(
    (file) => `${baseProtocol}/upload/products/${file.filename}`
  );

  const create = await product.create({
    ...productData,
    productImage: imagePaths,
    createdBy: userId,
  });

  for (let category of validCategories) {
    await productcategory.create({
      productId: create.id,
      categoryId: category.id,
    });
  }

  if (create) {
    create.dataValues.categories = validCategories;

    return res.status(201).json({
      status: "success",
      data: create,
    });
  } else {
    return next(new AppError("Failed to create the product"), 400);
  }
});

const getsData = catchAsync(async (req, res, next) => {
  const result = await product.findAll({
    include: [
      { model: user, attributes: ["firstName", "lastName", "email"] },
      {
        model: productcategory,
        attributes: ["categoryId"],
        include: [{ model: category, attributes: ["name"] }],
      },
    ],
  });

  if (result) {
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } else {
    return next(new AppError("Failed to findthe product"), 400);
  }
});

const getData = catchAsync(async (req, res, next) => {
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
    },
  });

  if (result) {
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } else {
    return next(new AppError("Invalid product id", 400));
  }
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

  let update = null;
  if (req.files) {
    const imagePaths = req.files.map((file) => {
      return `${baseProtocol}/upload/products/${file.filename}`;
    });

    deleteOldFiles(getProduct.productImage);

    update = await getProduct.update({
      ...productData,
      productImage: imagePaths,
      createdBy: userId,
    });
  } else {
    update = await getProduct.update({
      ...productData,
      createdBy: userId,
    });
  }

  const destroyCategory = await productcategory.destroy({
    where: {
      productId: update.id,
    },
  });

  if (!destroyCategory) {
    return next(new AppError("Failed delete the product categories", 400));
  }

  const validCategories = await category.findAll({
    where: {
      id: categoryIds,
    },
    attributes: ["id", "name"],
  });

  if (validCategories.length !== categoryIds.length) {
    return next(new AppError("Some category id are invalid"), 400);
  }

  for (let category of validCategories) {
    await productcategory.create({
      productId: update.id,
      categoryId: category.id,
    });
  }

  if (update) {
    update.dataValues.categories = validCategories;

    return res.status(200).json({
      status: "success",
      data: update,
    });
  } else {
    return next(new AppError("Failed update the product", 400));
  }
});

const truncateData = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const getProducts = await product.findAll({
    where: {
      createdBy: userId,
    },
  });

  if (getProducts.length === 0) {
    return next(new AppError("Products not found", 400));
  }

  await Promise.all(
    getProducts.map(async (p) => {
      if (p.productImage) {
        deleteOldFiles(p.productImage);
      }

      const existCategories = await productcategory.findAll({
        where: {
          productId: p.id,
        },
      });

      if (existCategories.length > 0) {
        const destroyCategory = await productcategory.destroy({
          where: {
            productId: p.id,
          },
        });

        if (!destroyCategory) {
          return next(
            new AppError("Failed to delete the product categories", 400)
          );
        }
      }
    })
  );

  const truncate = await product.destroy({
    where: {
      createdBy: userId,
    },
  });

  if (truncate) {
    return res.status(200).json({
      status: "success",
      data: "Data truncated successfully",
    });
  } else {
    return next(new AppError("Failed to truncate the products", 400));
  }
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

  deleteOldFiles(getProduct.productImage);

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
