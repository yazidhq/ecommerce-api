const { signUp, logIn } = require("../controllers/auth.controller");

const router = require("express").Router();

const base_url = "/api/auth";

module.exports = (app) => {
  router.route(`${base_url}/signup`).post(signUp);
  router.route(`${base_url}/login`).post(logIn);

  app.use(router);
};
