const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const config = require("config");
const validUrl = require("valid-url");

const URL = require("../models/url");

// POST REQUEST TO /api/url/shortenurl
router.post("/shortenurl", async (req, res) => {
  const { longUrl } = req.body;
  const { customizedUrl } = req.body;
  // Get from config global folder
  const baseUrl = config.get("baseURL");

  // if baseUrl is not valid, then we return status 400, with message 'base url invalid'
  if (!validUrl.isUri(baseUrl)) {
    return res.status(500).json("base url invalid");
  }

  // Create URL code, using shortId
  // Checks long Url that comes in from the client
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await URL.findOne({ longUrl });
      let shortCode;
      let shortUrl;
      // if there is a url found, then return the url that was found in the response as a json
      if (url) {
        res.json(url);
        // if not, means we have to create it and put it in the databse
      } else {
        if (customizedUrl) {
          shortUrl = baseUrl + "/" + customizedUrl;
          shortCode = customizedUrl;
        } else {
          shortCode = shortId.generate();
          shortUrl = baseUrl + "/" + shortCode;
        }
        // create a new Url object to be inserted into the database
        url = new URL({
          shortCode,
          shortUrl,
          longUrl,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server Error");
    }
    // if longURL is invalid
  } else {
    res.status(400).json("long url Invalid");
  }
});

module.exports = router;
