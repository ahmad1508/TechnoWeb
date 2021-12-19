const db = require("./db");
const express = require("express");
const cors = require("cors");
const authenticator = require("./authenticator");

const app = express();
const authenticate = authenticator({
  test_payload_email: process.env["TEST_PAYLOAD_EMAIL"],
  jwks_uri: "http://127.0.0.1:5556/dex/keys",
});

app.use(require("body-parser").json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(["<h1>ECE WebTech Chat</h1>"].join(""));
});

const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// var STATIC_CHANNELS = [{
//   name: 'Global chat',
//   participants: 0,
//   id: 1,
//   sockets: []
// }, {
//   name: 'Funny',
//   participants: 0,
//   id: 2,
//   sockets: []
// }];

// io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
//   console.log('new client connected');
//   socket.emit('connection', null);
//   socket.on('channel-join', id => {
//     console.log('channel join', id);
//     STATIC_CHANNELS.forEach(c => {
//         if (c.id === id) {
//             if (c.sockets.indexOf(socket.id) == (-1)) {
//                 c.sockets.push(socket.id);
//                 c.participants++;
//                 io.emit('channel', c);
//             }
//         } else {
//             let index = c.sockets.indexOf(socket.id);
//             if (index != (-1)) {
//                 c.sockets.splice(index, 1);
//                 c.participants--;
//                 io.emit('channel', c);
//             }
//         }
//     });

//     return id;
// });
// socket.on('send-message', message => {
//     io.emit('message', message);
// });

// socket.on('disconnect', () => {
//     STATIC_CHANNELS.forEach(c => {
//         let index = c.sockets.indexOf(socket.id);
//         if (index != (-1)) {
//             c.sockets.splice(index, 1);
//             c.participants--;
//             io.emit('channel', c);
//         }
//     });
// });

// });

// Channels
app.get("/channels", authenticate, async (req, res) => {
  const allChannels = await db.channels.list();
  const channels = [];
  allChannels.map((channel) => {
    for (let i = 0; i < channel.participants.length; i++) {
      if (channel.participants[i] === req.user.email) {
        channels.push(channel)
        break;
      } else if (channel.email === req.user.email) {
        channels.push(channel)
        break;
      } else {
      }
    }
  })

  res.json(channels);
});

app.post("/channels", async (req, res) => {
  const createChannel = req.body
  createChannel.participants = createChannel.participants.split(",")
  const channel = await db.channels.create(createChannel);
  res.status(201).json(channel);
});

app.get("/channels/:id", async (req, res) => {
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

app.put("/channels/:id", async (req, res) => {
  console.log(req.body)
  const existing = await db.channels.get(req.params.id);
  if (req.body.action === "Quit") {
    console.log("quit")
    const index = existing.participants.indexOf(req.body.user)
    existing.participants.splice(index, 1)
  } else {
    console.log("invitation")
    const invitation = req.body.invitation.split(",");
    invitation.forEach(invitee => {
      existing.participants.push(invitee)
    })
  }
  const channel = await db.channels.update(req.params.id, existing);
  res.json(channel);
});

app.delete("/channels/:id", async (req, res) => {
  const channel = await db.channels.delete(req.params.id)

  res.json(channel);
})

// Messages

app.get("/channels/:id/messages", async (req, res) => {
  try {
    const channel = await db.channels.get(req.params.id);
  } catch (err) {
    return res.status(404).send("Channel does not exist.");
  }
  const messages = await db.messages.list(req.params.id);
  res.json(messages);
});

app.post("/channels/:id/messages", async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body);
  res.status(201).json(message);// send the message to the the axios request
});

app.put("/channels/:id/message/:creation", async (req, res) => {
  console.log(req.params.id, req.params.creation)
  const message = await db.messages.update(req.params.id, req.params.creation, req.body);
  res.status(201).json(message);// send the message to the the axios request
});

app.delete("/channels/:id/message/:creation", async (req, res) => {
  const message = await db.messages.delete(req.params.id, req.params.creation);
  res.status(201).json(message);// send the message to the the axios request
});




// Users

app.get("/users", async (req, res) => {
  const users = await db.users.list();
  res.json(users);
});
/*app.post("/friends", async (req, res) => {
  const users = await db.users.list();
  const friends = req.body.friends;
  console.log(friends)
  const friendsInfo = []
  users.map((user) => {
    for (let i = 0; i < friends.length; i++) {
      if (friends[i] === user.id) { friendsInfo.push(user) }
    }
  })
  res.send(friendsInfo);
});*/
app.post("/users", async (req, res) => {
  console.log(req.body)
  const user = await db.users.create(req.body.user, req.body.id);
  res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  const user = await db.users.get(req.params.id);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  let user
  if (req.body.request === 'invited') {
    const newinvit = req.body.user;
    const index = newinvit.invitation.indexOf(req.body.invitationFrom)
    if (index === (-1)) {
      newinvit.invitation.push(req.body.invitationFrom)
      user = await db.users.update(req.params.id, newinvit);
    }
  } else if (req.body.request === 'reject') {
    const me = req.body.user;
    const index = me.invitation.indexOf(req.params.id)
    me.invitation.splice(index, 1)
    user = await db.users.update(me.id, me);

  } else if (req.body.request === 'accept') {
    console.log(req.body)
    const me = req.body.user;
    const index = me.invitation.indexOf(req.params.id)
    if (index !== (-1)) {
      me.invitation.splice(index, 1)
    }
    me.friends.push(req.params.id)
    user = await db.users.update(me.id, me);

  } else if (req.body.request === 'delete') {
    const me = req.body.user;
    const index = me.friends.indexOf(req.params.id)
    me.friends.splice(index, 1)
    user = await db.users.update(me.id, me)
  } else {
    user = await db.users.update(req.params.id, req.body);
  }

  res.json(user);
});

module.exports = http;
