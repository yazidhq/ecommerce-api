const {
  createData,
  getsData,
  getData,
  updateData,
  truncateData,
  deleteData,
} = require("../controllers/order.controller");

const {
  authentication,
  restrictTo,
} = require("../middleware/authentication.middleware");

const router = require("express").Router();

const base_url = "/api/order";

module.exports = (app) => {
  router
    .route(`${base_url}/`)
    .post(authentication, restrictTo("2"), createData)
    .get(authentication, getsData)
    .delete(authentication, restrictTo("2"), truncateData);

  router
    .route(`${base_url}/:id`)
    .get(authentication, getData)
    .patch(authentication, restrictTo("2"), updateData)
    .delete(authentication, restrictTo("2"), deleteData);

  app.use(router);
};
