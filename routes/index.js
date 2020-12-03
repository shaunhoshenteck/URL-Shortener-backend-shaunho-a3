// Creates end point for the shortened Url
const { json } = require("express");
const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const URL = require("../models/url");

router.get("/abc", (req, res) => {
  res.send("Hello World");
});

// GET request
router.get("/:code", async (req, res) => {
  try {
    const url = await URL.findOne({ shortCode: req.params.code });
    // if the url exists, the we redirect to the longURL
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("There is a server error");
  }
});

module.exports = router;
