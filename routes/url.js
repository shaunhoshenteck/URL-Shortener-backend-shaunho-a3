const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const config = require("config");
const validUrl = require("valid-url");

const URL = require("../models/url");

// POST REQUEST TO /api/url/create
router.post("/create", async (req, res) => {
  const { longUrl, customString } = req.body;
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
        console.log("longUrl already exists");
        console.log(url);
        return res.status(201).json("URL ALREADY EXISTS: " + url.shortUrl);
        // if not, means we have to create it and put it in the databse
      } else {
        if (customString) {
          shortUrl = baseUrl + "/" + customString;
          shortCode = customString;
        } else {
          shortCode = shortId.generate();
          shortUrl = baseUrl + "/" + shortCode;
        }

        // check shortCode is not duplicate
        let data = await URL.findOne({ shortCode });
        if (data) {
          console.log(`customString: ${customString} already exists`);
          return res
            .status(409)
            .json(`customString: ${customString} already exists`);
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
    return res.status(401).json("long url Invalid");
  }
});

module.exports = router;
