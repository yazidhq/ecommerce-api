const { signUp, signIn } = require("../controllers/auth.controller");
const {
  validateSignUp,
  validateSignIn,
} = require("../validators/user.validator");

const router = require("express").Router();

const base_url = "/api/auth";

module.exports = (app) => {
  router.route(`${base_url}/signup`).post(validateSignUp, signUp);
  router.route(`${base_url}/signin`).post(validateSignIn, signIn);

  app.use(router);
};
