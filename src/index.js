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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("gallery server successfly");
});

app.use(cors());

app.use(helmet());

mainRouter.forEach((rItem) => {
  app.use(rItem.path, rItem.rout);
});

app.use(errorMiddleware);
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
