const express = require("express");
const cors = require("cors");
const { mainRouter } = require("./routes");
const { default: helmet } = require("helmet");
const { ConnectDB } = require("./utils/config.database");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { PORT } = require("./utils/secret");
const { setupSwagger } = require("./swagger");
const { startCleanupCron } = require("./utils/cron-jobs");
const app = express();
ConnectDB();

// Cron job ni ishga tushirish
startCleanupCron();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8989",
        "https://news-api-backend-1t0e.onrender.com",
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("gallery server successfly");
});

mainRouter.forEach((rItem) => {
  app.use(rItem.path, rItem.rout);
});

app.use(errorMiddleware);
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
