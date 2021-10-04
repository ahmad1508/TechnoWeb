const express = require("express");
const handles = require("./routes/handles");

const app = express();

app.use("/hello", handles);

app.listen(8080);
