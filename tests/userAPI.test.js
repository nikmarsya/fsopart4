const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User =require('../models/user')
const bcrypt = require('bcrypt')
const { usersinDB,initUser } = require('./test_helper')
const api = supertest(app)

beforeAll(async () => {
  await usersinDB()
})


test('retrieves all user data', async () => {
  const response = await api.get('/api/users')
  expect(response.body).toHaveLength(initUser.length)
})
  
test('create new user', async () => {
    const newuser =  {
        username: "farida78",
        name: "Faridah Salleh",
        password:"121278"
    }

      await api.post('/api/users')
      .send(newuser)
      .expect(201)

})

test('with invalid data: username already exists', async () => {
    const newuser =  {
      username: "mika12",
      name: "romika ghaus",
      password:"121212"
    }

    await api.post('/api/users')
    .send(newuser)
    .expect(400)
})

test('with invalid data: password length less than 3', async () => {
    const newuser =  {
      username: "talib",
      name: "abi talib",
      password:"1"
    }

    await api.post('/api/users')
    .send(newuser)
    .expect(400)
})

afterAll(async () => { 
  await User.deleteMany()
  mongoose.connection.close()
})

