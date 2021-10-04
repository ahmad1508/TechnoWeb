const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public")); //the static files are in public file

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("home", { title: "homepage" });
});

app.get("/hello", (req, res) => {
  res.render("hello", { title: "hello page", name: "enter your name in the url  /name" });
});


app.get("/hello/:name", (req, res) => {
  res.render("hello", { title: "Hello page", name: req.params.name });
});

app.use((req, res) => {
  res.render("404", { title: "404 error" });
});
/*app.get("/metrics.json", (req, res) => {
  metrics.get((err, data) => {
    if (err) throw err;
    res.status(200).json(data);
  });
});*/

module.exports = app