require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const app = express();
const cors = require("cors");
const corsOption = require("./app/middleware/cors.middleware");
const helmet = require("helmet");
const limiter = require("./app/middleware/limitter.middleware");
const sanitizeGlobal = require("./app/middleware/sanitize.middleware");
const logger = require("./app/utils/logger");

app.use(cors(corsOption));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static("public"));
app.use(limiter);
app.use(sanitizeGlobal);
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Backend RESTful-API",
  });
});

const { glob } = require("glob");
const path = require("path");

glob.sync("./app/routes/*.js").forEach((file) => {
  require(path.resolve(file))(app);
});

const catchAsync = require("./app/utils/catch.async");
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
