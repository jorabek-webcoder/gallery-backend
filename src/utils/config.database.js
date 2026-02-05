const { connect } = require("mongoose");
const { MONGO_URI } = require("./secret");

const ConnectDB = async () => {
  await connect(MONGO_URI);
  console.log("connect DB");
};

module.exports = { ConnectDB };
