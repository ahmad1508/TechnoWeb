const express = require("express");
const ejs = require("ejs");
const app = express();

app.listen(3000);
//for ejs files
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
