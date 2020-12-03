const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const config = require("config");
const validUrl = require("valid-url");

const URL = require("../models/url");

// GET /api/url/all
router.get("/all", async (req, res) => {
  try {
    let all_datas = await URL.find();
    return res.json(all_datas);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server error");
  }
});

// GET /api/url/:shortcode
router.get("/:urlCode", async (req, res) => {
  const code = req.params.urlCode;
  try {
    let data = await URL.findOne({ shortCode: code });
    if (data) {
      return res.json(data);
    } else {
      console.log(`Cannot find urlCode: ${code}`);
      return res.status(404).json(`Cannot find urlCode: ${code}`);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server error");
  }
});

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
        return res.status(201).json(url);
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
  const code = req.params.shortcode;
  if (validUrl.isUri(newLongUrl)) {
    try {
      let updateUrl = await URL.findOneAndUpdate(
        { shortCode: req.params.shortcode },
        { longUrl: newLongUrl, date: new Date() },
        { new: true }
      );
      return res.json(updateUrl);
    } catch (err) {
      res.status(500).json("There is a server error");
    }
  } else {
    res.status(401).json("new long url is invalid");
  }
});

module.exports = router;
