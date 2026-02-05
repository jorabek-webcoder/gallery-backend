const express = require("express");
const cors = require("cors");
const { mainRouter } = require("./routes");
const { default: helmet } = require("helmet");
const { ConnectDB } = require("./utils/config.database");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { PORT, ALLOWED_ORIGINS } = require("./utils/secret");
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
      // Environment variable'dan originlarni olish
      let allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8685",
        "https://gallery-backend-g1ha.onrender.com",
      ];

      // Production uchun .env dan qo'shimcha originlar
      if (ALLOWED_ORIGINS) {
        const envOrigins = ALLOWED_ORIGINS.split(',').map(o => o.trim());
        allowedOrigins = [...allowedOrigins, ...envOrigins];
      }
      
      // Swagger, Postman va backend o'zidan kelgan so'rovlar uchun
      if (!origin) {
        callback(null, true);
        return;
      }
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        console.log(`✅ Allowed origins:`, allowedOrigins);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
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
