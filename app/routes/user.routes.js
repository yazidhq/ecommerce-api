const {
  createData,
  getsData,
  truncateData,
  getData,
  updateData,
  deleteData,
} = require("../controllers/user.controller");

const {
  authentication,
  restrictTo,
} = require("../middleware/authentication.middleware");

const router = require("express").Router();

const base_url = "/api/user";

module.exports = (app) => {
  router
    .route(`${base_url}/`)
    .post(authentication, restrictTo("0"), createData)
    .get(authentication, restrictTo("0"), getsData)
    .delete(authentication, restrictTo("0"), truncateData);

  router
    .route(`${base_url}/:id`)
    .get(authentication, restrictTo("0"), getData)
    .patch(authentication, restrictTo("0"), updateData)
    .delete(authentication, restrictTo("0"), deleteData);

  app.use(router);
};
