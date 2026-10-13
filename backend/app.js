
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Allowed origins: reads from ALLOWED_ORIGINS env variable (comma-separated).
// Example for Railway: ALLOWED_ORIGINS=https://your-app.vercel.app
// Falls back to localhost for local development.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully",
  });
});

app.use("/", require("./routes/authRoutes"));
app.use("/recipes", require("./routes/recipeRoutes"));
app.use("/cutting-orders", require("./routes/cuttingOrderRoutes"));
app.use("/verification", require("./routes/verificationRoutes"));
app.use("/sewing-queue", require("./routes/sewingQueueRoutes"));

module.exports = app;
