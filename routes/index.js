// Creates end point for the shortened Url
const express = require("express");
const router = express.Router();
const URL = require("../models/url");

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

// Delete Request To /:shortUrl
router.delete("/:shorturl", async (req, res) => {
  try {
    const removedUrl = await URL.deleteOne({ shortCode: req.params.shorturl });
    res.json(removedUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json("There is a server error");
  }
});

module.exports = router;
