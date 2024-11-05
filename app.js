require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const app = express();

const auth = require("./app/routes/auth.route");
const product = require("./app/routes/product.route");
const catchAsync = require("./app/utils/catch.async.");
const AppError = require("./app/utils/app.error");
const globalErrorHandler = require("./app/controllers/error.controller");
const {
  authentication,
  restrictTo,
} = require("./app/middleware/authentication.middleware");

app.use(express.json());

app.use("/api/auth", auth);
app.use("/api/product", authentication, restrictTo("1"), product);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Cant find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log("Server up and running in: ", PORT);
});
