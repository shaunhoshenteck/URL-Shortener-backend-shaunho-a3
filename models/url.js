const { Mongoose } = require("mongoose");
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  urlCode: String,
  shortUrl: String,
  longUrl: String,
  date: { type: String, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);
