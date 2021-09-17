const url = require("url");
const qs = require("querystring");
const fs = require("fs");

//export du module
module.exports = {
  serverHandle: function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });

    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    let direc = "./views/";
    switch (req.url) {
      case "/":
        direc += "homePage.html";
        break;
      default:
        if (path === "/hello" && params["name"] === "Ahmad") {
          direc += "index.html";
        } else if (
          path === "/hello" &&
          "name" in params &&
          params["name"] !== ""
        ) {
          direc += "anonymous.html";
        } else if (
          path !== "/hello" ||
          !("name" in params) ||
          params["name"] === ""
        ) {
          direc += "404.html";
        }
    }

    fs.readFile(direc, (err, data) => {
      if (err) {
        console.log(err);
        res.end();
      } else {
        res.write(data);
        if (
          path === "/hello" &&
          "name" in params &&
          params["name"] !== "" &&
          params["name"] !== "Ahmad"
        ) {
          res.write(`<h2> ${params["name"]} </h2>`);
        }
        res.end();
      }
    });
  },
};
