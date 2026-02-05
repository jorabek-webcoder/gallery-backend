const { config } = require("dotenv");
config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const BASE_API_URL = process.env.BASE_API_URL;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

module.exports = { PORT, MONGO_URI, BASE_API_URL, ALLOWED_ORIGINS };
