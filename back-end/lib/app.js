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

const http = require("http").createServer(app);

// Channels
app.get("/channels", authenticate, async (req, res) => {
  const allChannels = await db.channels.list();
  const channels = [];
  allChannels.map((channel) => {
    channel.participants.map((participant) => {
      if (participant === req.user.email) channels.push(channel);
    });
    if (channel.email === req.user.email) channels.push(channel);
  });
  res.json(channels);
});

app.post("/channels", async (req, res) => {
  const createChannel = req.body;
  createChannel.participants =
    createChannel.participants !== ""
      ? createChannel.participants.split(",")
      : [];

  const channel = await db.channels.create(createChannel);
  res.status(201).json(channel);
});

app.get("/channels/:id", async (req, res) => {
  const channel = await db.channels.get(req.params.id);
  res.json(channel);
});

app.put("/channels/:id", async (req, res) => {
  console.log(req.body);
  const existing = await db.channels.get(req.params.id);
  if (req.body.action === "Quit") {
    const index = existing.participants.indexOf(req.body.user);
    existing.participants.splice(index, 1);
  } else {
    req.body.invitation.split(",").forEach((invitee) => {
      const index = existing.participants.indexOf(invitee);
      if (index === -1) {
        existing.participants.push(invitee);
      }
    });
  }
  const channel = await db.channels.update(req.params.id, existing);
  res.json(channel);
});

app.delete("/channels/:id", async (req, res) => {
  const channel = await db.channels.delete(req.params.id);

  res.json(channel);
});

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
  res.status(201).json(message); // send the message to the the axios request
});

app.put("/channels/:id/message/:creation", async (req, res) => {
  console.log(req.params.id, req.params.creation);
  const message = await db.messages.update(
    req.params.id,
    req.params.creation,
    req.body
  );
  res.status(201).json(message); // send the message to the the axios request
});

app.delete("/channels/:id/message/:creation", async (req, res) => {
  const message = await db.messages.delete(req.params.id, req.params.creation);
  res.status(201).json(message); // send the message to the the axios request
});

// Users

app.get("/users", async (req, res) => {
  const users = await db.users.list();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await db.users.create(req.body.user, req.body.id);
  res.status(201).json(user);
});

app.get("/users/:id", async (req, res) => {
  const user = await db.users.get(req.params.id);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  let user;
  let me;
  let index;
  let sender;
  switch (req.body.request) {
    case "invited":
      if (req.body.invitationFrom !== req.body.user.id) {
        const newinvit = req.body.user;
        index = newinvit.invitation.indexOf(req.body.invitationFrom);
        if (index === -1) {
          newinvit.invitation.push(req.body.invitationFrom);
          const me = await db.users.get(req.body.invitationFrom);
          me.sentInvites.push(newinvit.id);
          await db.users.update(req.params.id, newinvit);
          user = await db.users.update(me.id, me);
        }
      }
      break;
    case "reject":
      const senderID = req.params.id;
      sender = await db.users.get(senderID);
      me = req.body.user;
      index = me.invitation.indexOf(req.params.id);
      const indexSender = sender.sentInvites.indexOf(me.id);
      me.invitation.splice(index, 1);
      sender.sentInvites.splice(indexSender, 1);
      user = await db.users.update(me.id, me);
      await db.users.update(sender.id, sender);
      break;
    case "accept":
      me = req.body.user; //get the authenticated user
      index = me.invitation.indexOf(req.params.id); //get the index of the snder in the invitation list
      sender = await db.users.get(req.params.id); // and get the info in the db
      const indexInSent = sender.sentInvites.indexOf(me.id); //get the auth user in the sent invites if the sender
      if (index !== -1) {
        me.invitation.splice(index, 1); //remove from the invitation list
        sender.sentInvites.splice(indexInSent, 1); //remove from the sentInvites list
      }
      me.friends.push(sender.id); //place in the friends list
      sender.friends.push(me.id);

      user = await db.users.update(me.id, me);
      await db.users.update(sender.id, sender);
      break;
    case "delete":
      me = req.body.user;
      index = me.friends.indexOf(req.params.id);
      me.friends.splice(index, 1);
      user = await db.users.update(me.id, me);
      break;
    case "modify":
      user = await db.users.update(req.params.id, req.body.user);
      break;
    default:
      user = await db.users.update(req.params.id, req.body);
  }
  res.json(user);
});

module.exports = http;
