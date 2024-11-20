const { validationResult, body } = require("express-validator");

const validateSignUp = [
  body("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isLength({ min: 1, max: 1 })
    .withMessage("User type must be 1 characters"),
  body("firstName")
    .notEmpty()
    .withMessage("Firstname is required")
    .isLength({ min: 3 })
    .withMessage("Firstname must be at least 3 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Lastname is required")
    .isLength({ min: 3 })
    .withMessage("Lastname must be at least 3 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateSignIn = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateSignUp,
  validateSignIn,
};
