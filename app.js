require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const app = express();

app.use(express.json());

const { glob } = require("glob");
const path = require("path");

glob.sync("./app/routes/*.js").forEach((file) => {
  require(path.resolve(file))(app);
});

const catchAsync = require("./app/utils/catch.async.");
const AppError = require("./app/utils/app.error");
const globalErrorHandler = require("./app/controllers/error.controller");

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
