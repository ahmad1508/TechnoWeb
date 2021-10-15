
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')

const store =  {
  channels: {
   
    "channel:1902": {
      "name": "Channel 1"
    },
    "channel:9302": {
      "name": "Channel 2"
    }
  },
  users: {
    "user:3002": {
      "username": "geoffrey",
      "password": "rki903ir09io"
    },
    "user:3920": {
      "username": "david",
      "password": "32u0fjioer"
    }
  },
  messages:{
    "message:1902:1288329299": {
      "author": "3920",
      "content": "ping"
    },
    "message:1902:1288339049": {
      "author": "3002",
      "content": "pong"
    },
  }
}
// const level = require('level')
// const db = level(__dirname + '/../db')

module.exports = {
  channels: {
    create: async (channel) => {
      if(!channel.name) throw Error('Invalid channel')
      const id = uuid()
      store.channels[id] = channel
      //await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, {id: id})
    },
    list: async () => {
      return Object.keys(store.channels).map( (id) => {
        const channel = clone(store.channels[id])
        channel.id = id
        return channel
      })
      // return new Promise( (resolve, reject) => {
      //   const channels = []
      //   db.createReadStream({
      //     gt: "channels:",
      //     lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
      //   }).on( 'data', ({key, value}) => {
      //     channel = JSON.parse(value)
      //     channel.id = key.split(':')[1]
      //     channels.push(channel)
      //   }).on( 'error', (err) => {
      //     reject(err)
      //   }).on( 'end', () => {
      //     resolve(channels)
      //   })
      // })
    },
    update: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      store.channels[id] = merge(original, channel)
    },
    delete: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      delete store.channels[id]
    }
  },


  admin: {
    clear: async () => {
      store.channels = {}
      store.users = {}
      store.messages = {}
      // await db.clear()
    }
  },


  users: {
    create: async (user)=>{
      if(!user.username) throw Error('invalid user');
      const id = uuid();
      store.users[id]=user;
      return merge(user,{id: id});
    },
    list: async ()=>{
      return Object.keys(store.users).map((id)=>{
        const user = clone(store.users[id])
        user.id = id
        return user
      })  
    },
    update: (id,user)=>{
      const original = store.users[id]
      if(!original) throw Error('Unregistered user id')
      store.users[id] = merge(original, user)
    },
    delete: (id, user) => {
      const original = store.users[id]
      if(!original) throw Error('Unregistered user id')
      delete store.users[id]
    }
  },


  messages: {
    create: async (channel, message)=>{
      if(!message.content) throw Error('invalid content');
      if(!message.author) throw Error('invalid user');
      const id = 'message:' + channel + ':' + Date.now()
      store.messages[id]=message;
      return merge(message,{id: id});
    },
    list: async ()=>{
      return Object.keys(store.messages).map((id)=>{
        const creation = id.split(':')[2]
        const message = clone(store.messages[id])
        message.id = id
        message.creation = creation
        return message
      })  
    },
    update: (id,message)=>{
      const original = store.messages[id]
      if(!original) throw Error('Unregistered message id')
      store.messages[id] = merge(original, message)
    },
    delete: (id, message) => {
      const original = store.messages[id]
      if(!original) throw Error('Unregistered message id')
      delete store.messages[id]
    }
  }
}
