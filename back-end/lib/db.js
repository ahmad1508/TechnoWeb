
const { v4: uuid } = require('uuid')
const { clone, merge } = require('mixme')
const microtime = require('microtime')
const level = require('level')
const db = level(__dirname + '/../db')

module.exports = {
  /**********************************
   *    Channel CRUD operation  
   * ********************************/
  channels: {
    /****************  CREATE  ****************** */
    create: async (channel,email) => {
      if (!channel.name) throw Error('Invalid channel')
      const id = uuid()
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, { id: id })
    },
    /****************  GET  ****************** */
    get: async (id) => {
      if (!id) throw Error('Invalid id')
      const data = await db.get(`channels:${id}`)
      const channel = JSON.parse(data)
      return merge(channel, { id: id })
    },
    /****************  LIST  ****************** */
    list: async () => {
      return new Promise((resolve, reject) => {
        const channels = []
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]
          channels.push(channel)
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(channels)
        })
      })
    },
    /****************  UPDATE  ****************** */
    update: async(id, channel) => {
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, { id: id })
      
    },
    /****************  DELETE  ****************** */
    delete: (id, ) => {
      
      //if (!data) throw Error('Unregistered channel id')
      const channel = db.del(`channels:${id}`)
      return merge(channel, { id: id })

    } 
  },
  /**********************************
   *    Messages CRUD operation  
   * ********************************/
  messages: {
    create: async (channelId, message) => {
      if (!channelId) throw Error('Invalid channel')
      if (!message.author) throw Error('Invalid message')
      if (!message.content) throw Error('Invalid message')
      creation = microtime.now()
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content
      }))
      return merge(message, { channelId: channelId, creation: creation })
    },
    list: async (channelId) => {
      return new Promise((resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          message = JSON.parse(value)
          const [, channelId, creation] = key.split(':')
          message.channelId = channelId
          message.creation = creation
          messages.push(message)
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(messages)
        })
      })
    },
    /****************  UPDATE  ****************** */
    update: async(channelId, message) => {
      if (!message.author) throw Error('Invalid message')
      if (!message.content) throw Error('Invalid message')
      creation = message.creation
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content
      }))
      return merge(message, { channelId: channelId, creation: creation })
      //if (!original) throw Error('Unregistered channel id')
      //store.channels[id] = merge(original, channel) */
    },
    /****************  DELETE  ****************** */
    delete: (channelId,creation) => {
      //if (!data) throw Error('Unregistered channel id')
      db.del(`messages:${channelId}:${creation}`)
    } 
  },
  /**********************************
   *    Users CRUD operation  
   * ********************************/
  users: {
    create: async (user, id) => {
      if (!user.username) throw Error('Invalid user')
      if (!id) throw Error('Invalid id')
      await db.put(`users:${id}`, JSON.stringify(user))
      return merge(user, { id: id })
    },
    get: async (id) => {
      if (!id) throw Error('Invalid id')
      try {
        const data = await db.get(`users:${id}`)
        const user = JSON.parse(data)
        return merge(user, { id: id })
      } catch (error) {
        return undefined
      }
    },
    list: async () => {
      return new Promise((resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on('data', ({ key, value }) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on('error', (err) => {
          reject(err)
        }).on('end', () => {
          resolve(users)
        })
      })
    },
    update: async (id, user) => {
      if (!user.username) throw Error('Invalid user')
      if (!id) throw Error('Invalid id')
      await db.put(`users:${id}`, JSON.stringify(user))
      return merge(user, { id: id })
    },
    delete: (id, user) => {
      db.del(`users:${id}`)

    }
  },
  /**********************************
   *    Admin CRUD operation  
   * ********************************/
  admin: {
    clear: async () => {
      await db.clear()
    }
  }
}