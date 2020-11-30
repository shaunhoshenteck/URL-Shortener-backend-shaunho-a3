const config = require("config");
const mongoose = require("mongoose");
const db = config.get("mongoURI");

const connectToDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("CONNETED TO MONGODB");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
