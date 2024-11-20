const rateLimit = require("express-rate-limit");
const catchAsync = require("../utils/catch.async");
const ratelimitlogs = require("../db/models/ratelimitlogs");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many request!",
  standardHeaders: true,
  legacyHeaders: false,
  handler: catchAsync(async (req, res, next, options) => {
    await ratelimitlogs.create({
      ip_address: req.ip,
      endpoint: req.originalUrl,
    });

    res.status(options.statusCode).json(options.message);
  }),
});

module.exports = limiter;
