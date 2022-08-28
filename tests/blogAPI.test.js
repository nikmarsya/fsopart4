const { before } = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')
const { initBlog,blogsinDB,usersinDB,initUser } = require('./test_helper')
const api = supertest(app)

let token = "";

beforeAll(async () => {
  await usersinDB()
  
  const res = await api
  .post('/api/login')
  .send({ "username": initUser[0].username,"password":initUser[0].password })
  token = res.body.token
})

beforeEach(async () => {
  await Blog.insertMany(initBlog)   
})

describe('view blog entries',() =>{
  test('where all entries a received in JSON format', async() => {   
    await api  
        .get('/api/blogs')
        .set('Authorization','bearer ' + token)
        .expect(200)
        .expect('Content-Type',/application\/json/) 
    
    const response = await api
      .get('/api/blogs')
      .set('Authorization','bearer ' + token)
    expect(response.body).toHaveLength(initBlog.length)
  })

  
 /*
  test('get the first blog url ', async () => {
    const response = await api.get('/api/blogs')
  
    const url = response.body.map(r => r.url)
  
    expect(url).toContain('http:like.com')
  })*/
})

describe('proper formatting',() => {
  test('where id property is defined',async() => {
  
    const response = await api.get('/api/blogs').set('Authorization','bearer ' + token)
    const selectBlog = response.body[0]
    expect(selectBlog.id).toBeDefined()
  })
})


describe('creating new blog entry',() =>{
  test('where a valid blog is added', async () => {
    
    const newBlog = 
    {
        title: "Grokking Algorithm",
        author: "Aditya Y Bhargava",
        url: "https://AlgorithmandData/",
        likes: 112
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization','bearer ' + token)
      .send(newBlog)
      .expect(201)  
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs').set('Authorization','bearer ' + token)
    const contents = response.body.map(r => r.title)
  
    expect(response.body).toHaveLength(initBlog.length + 1)
    expect(contents).toContain('Grokking Algorithm')
  })

  
  test('where title and url is missing', async () => {
  
    const newBlog = 
    {
        author: "Aditya Y Bhargava",
        likes: 112
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization','bearer ' + token)
      .send(newBlog)
      .expect(400)  
})

test('where likes property is missing', async () => {
 
    const newBlog = 
    {
        title: "Data Algorithm",
        author: "Deepika Bhargava",
        url: "https://AlgorithmandData/" 
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization','bearer ' + token)
      .send(newBlog)
      .expect(201)  
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs').set('Authorization','bearer ' + token)
  
    const entry = response.body.find(r => r.title === "Data Algorithm")
  
    expect(entry.likes).toEqual(0)
  })
})

test('delete blog entry',async () => {
    const firstuser = await User.find({_id:"63075a5f9f7efed091c3ba61"})
    const blogid = firstuser[0].blogs[0]


    await api
      .delete(`/api/blogs/${blogid.toString()}`)
      .set('Authorization','bearer ' + token)
      .expect(204)
      
      const deletedEntries =  await Blog.find({})
      expect(deletedEntries).toHaveLength(initBlog.length-1)
      
  })

test('update blog entry', async () => {
    const result = await Blog.find({})
    const blogs = result.map(b => b.toJSON())

    const selectBlog = blogs[0]
  

    const likes = {...selectBlog,likes:100}
    
    const response = await api
      .put(`/api/blogs/${selectBlog.id}`)
      .set('Authorization','bearer ' + token)
      .send(likes)
    
      const afterresult = await Blog.find({})
      const after = afterresult.map(b => b.toJSON())
  
    expect(response.body).toEqual(after[0])

})

afterEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

})
afterAll(() => { mongoose.connection.close() })