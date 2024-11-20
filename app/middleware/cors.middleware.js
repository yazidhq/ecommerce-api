const corsOption = {
  origin: ["*", "https://127.0.0.1"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
    "Authorization",
    "Cache-Control",
    "Content-Type",
    "Content-Length",
    "Host",
    "User-Agent",
    "Accept",
    "Accept-Encoding",
    "Connection",
    "X-Custom-Header",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 3600,
};

module.exports = corsOption;
