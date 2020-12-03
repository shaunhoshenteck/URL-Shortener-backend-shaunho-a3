const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();
const urlRouter = require("./routes/url");
const indexRouter = require("./routes/index");

// Connect to the Database
connectDB();

app.use(express.json({ extended: false }));
app.use(cors());

// routes
app.use("/", indexRouter);
app.use("/api/url", urlRouter);

const port = process.env.PORT || 5000;
console.log(port);

app.listen(port, () => console.log(`Server Running on Port ${port}`));
