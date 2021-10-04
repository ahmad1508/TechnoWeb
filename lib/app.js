const express = require('express')
const app = express()


const config = {
  port: 3000
}
const data = {
  channels: [{
    id: '1',
    name: 'Channel 1',
  }, {
    id: '2',
    name: 'Channel 2',
  }, {
    id: '3',
    name: 'Channel 3',
  }]
}

app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.redirect("/channels")
})

app.get('/channels', (req, res) => {
  res.render('channels');
})

app.get('/channel/:id', (req, res) => {

  const id = req.params.id;
  const ans = data.channels.filter((itm) => {
    return (itm.id === id)
  })
  res.send(ans[0].name)
})
module.exports = app;

// app.listen(config.port, () => {
  //   console.log(`Chat is waiting for you at http://localhost:${config.port}`)
// })



// const express = require("express");
// const app = express();

// app.set("view engine", "ejs");

// app.use(express.static("public")); //the static files are in public file

// app.get("/", (req, res) => {
//   res.redirect("/home");
// });

// app.get("/home", (req, res) => {
//   res.render("home", { title: "homepage" });
// });

// app.get("/hello", (req, res) => {
//   res.render("hello", { title: "hello page", name: "enter your name in the url  /name" });
// });


// app.get("/hello/:name", (req, res) => {
//   res.render("hello", { title: "Hello page", name: req.params.name });
// });

// app.use((req, res) => {
//   res.render("404", { title: "404 error" });
// });
// /*app.get("/metrics.json", (req, res) => {
//   metrics.get((err, data) => {
//     if (err) throw err;
//     res.status(200).json(data);
//   });
//});
