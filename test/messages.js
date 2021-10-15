
const supertest = require('supertest')
const app = require('../lib/app')
const db = require('../lib/db')

describe('messages', () => {
  
  beforeEach( async () => {
    await db.admin.clear()
  })
  
  it('list empty', async () => {
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send({name: 'channel 1'})
    // Get messages
    const {body: messages} = await supertest(app)
    .get(`/channels/${channel.id}/messages`)
    .expect(200)
    messages.should.eql([])
  })
  
  it('list one message', async () => {
    // Create a channel
    const {body: channel} = await supertest(app)
      .post('/channels')
      .send({name: 'channel 1'})
    // TODO create a user
    // ...
    const author = '12343543'
    // and a message inside it
    const message = 'Hello ECE'
    await supertest(app)
      .post(`/channels/${channel.id}/messages`)
      .send({
        content: message,
        author: author
      })
    // Get messages
    const {body: messages} = await supertest(app)
      .get(`/channels/${channel.id}/messages`)
      .expect(200)
    messages.should.match([{
      creation: (it) => it.should.be.approximately(Date.now(), 1000),
      content: message,
      author: author
    }])
  })
  
  it('add one element', async () => {
    // Create a channel
    const {body: channel} = await supertest(app)
    .post('/channels')
    .send({name: 'channel 1'})
    // Create a message inside it
    const {body: message} = await supertest(app)
    .post(`/channels/${channel.id}/messages`)
    .send({content: 'Hello ECE'})
    .expect(201)
    message.should.match({
      creation: (it) => it.should.be.approximately(Date.now(), 1000),
      content: 'Hello ECE'
    })
    // Check it was correctly inserted
    const {body: messages} = await supertest(app)
    .get(`/channels/${channel.id}/messages`)
    messages.length.should.eql(1)
  })
  
})
