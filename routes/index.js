// Creates end point for the shortened Url
const { json } = require("express");
const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
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

// Delete Request To /delete/:shortcode
router.delete("/delete/:shortcode", async (req, res) => {
  try {
    const removedUrl = await URL.deleteOne({ shortCode: req.params.shortcode });
    res.json(removedUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json("There is a server error");
  }
});

// Update Request To /edit/:shortcode
router.patch("/edit/:shortcode", async (req, res) => {
  const { newLongUrl } = req.body;
  if (validUrl.isUri(newLongUrl)) {
    console.log(newLongUrl);
    try {
      const updateUrl = await URL.updateOne(
        { shortCode: req.params.shortcode },
        { $set: { longUrl: newLongUrl } }
      );
      res.json(updateUrl);
    } catch (err) {
      console.error(err);
      res.status(500).json("There is a server error");
    }
  } else {
    res.status(401).json("new url is invalid");
  }
});

module.exports = router;
