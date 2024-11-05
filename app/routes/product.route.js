const {
  createData,
  getsData,
  truncateData,
  getData,
  updateData,
  deleteData,
} = require("../controllers/product.controller");

const {
  authentication,
  restrictTo,
} = require("../middleware/authentication.middleware");

const router = require("express").Router();

const base_url = "/api/product";

module.exports = (app) => {
  router
    .route(`${base_url}/`)
    .post(authentication, restrictTo("1"), createData)
    .get(authentication, restrictTo("1"), getsData)
    .delete(authentication, restrictTo("1"), truncateData);

  router
    .route(`${base_url}/:id`)
    .get(authentication, restrictTo("1"), getData)
    .patch(authentication, restrictTo("1"), updateData)
    .delete(authentication, restrictTo("1"), deleteData);

  app.use(router);
};
