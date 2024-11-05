const { signUp, logIn } = require("../controllers/auth.controller");

const router = require("express").Router();

router.route("/signup").post(signUp);
router.route("/login").post(logIn);

module.exports = router;
