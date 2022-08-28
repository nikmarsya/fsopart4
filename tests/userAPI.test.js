const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User =require('../models/user')
const bcrypt = require('bcrypt')
const { usersinDB,initUser } = require('./test_helper')
const api = supertest(app)



beforeEach( async() => {
   // await User.deleteMany({}) 
    await usersinDB()

})

test('all notes are returned', async () => {
    
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(initUser.length)
})
  
test('create user', async () => {
    const newuser =  {
        username: "pocoyo",
        name: "in the middle",
        password:"ghibli"
      }

      await api.post('/api/users')
      .send(newuser)
      .expect(201)

})

test('notes are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
    
})

test('login user with token', async () => {
  const res = await api
  .post('/api/login')
  .send({ "username": "suabid","password":"qwerty" })
  console.log('res',res.body)
 
})
afterEach(async () => {
  await User.deleteMany({})
})
afterAll(() => {
  mongoose.connection.close()
})

