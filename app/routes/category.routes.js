const {
  createData,
  getsData,
  truncateData,
  getData,
  updateData,
  deleteData,
} = require("../controllers/category.controller");

const {
  authentication,
  restrictTo,
} = require("../middleware/authentication.middleware");

const router = require("express").Router();

const base_url = "/api/category";

module.exports = (app) => {
  router
    .route(`${base_url}/`)
    .post(authentication, restrictTo("0", "1"), createData)
    .get(authentication, restrictTo("0", "1"), getsData)
    .delete(authentication, restrictTo("0", "1"), truncateData);

  router
    .route(`${base_url}/:id`)
    .get(authentication, restrictTo("0", "1"), getData)
    .patch(authentication, restrictTo("0", "1"), updateData)
    .delete(authentication, restrictTo("0", "1"), deleteData);

  app.use(router);
};
