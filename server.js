const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/jwtLogin", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongodb connected"));

app.post("/api/register", (req, res) => {
  console.log(req.body);
});

app.listen(9999);
