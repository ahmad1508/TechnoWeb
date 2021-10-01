const express = require("express");

const app = express();

app.listen(1337, () => console.log('server listening on ${app.get $("port")}'));

app.set("view engine", "ejs");

app.get("/hello/:name", (req, res) => {
  res.render("");
});
