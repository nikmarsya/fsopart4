const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initUser = [
  {
    _id:"63075a5f9f7efed091c3ba61",
    username: "mika12",
    name: "mikail gorbachev",
    password:"abc123",
    blogs:["6305fae75190db64fa5fa262","6305fb085190db64fa5fa264"]
  },
  {
    _id:"63075a929f7efed091c3ba64",
    username: "suabid",
    name: "sulayman abid",
    password:"qwerty",
    blogs:["63059542c96289e72c2119e3","6305a4e26386fd7dc225e7e7"]
  }
]

const initBlog = [
    {
      "_id": "63059542c96289e72c2119e3",
      "title": "when to find time",
      "author": "mika scottinson",
      "url": "http:like.com",
      "likes": 4,
      "user": "63075a929f7efed091c3ba64"
    },
    {
      "_id": "6305a4e26386fd7dc225e7e7",
      "title": "going to the west",
      "author": "uday narash",
      "url": "http://travelfood.am",
      "likes": 100,
      "user": "63075a929f7efed091c3ba64"
    },
    {
      "_id": "6305fae75190db64fa5fa262",
      "title": "React patterns",
      "author": "Michael Chan",
      "url": "https://reactpatterns.com/",
      "likes": 7,
      "user": "63075a5f9f7efed091c3ba61"
    },
    {
      "_id": "6305fb085190db64fa5fa264",
      "title": "React for Beginner",
      "author": "Michael Chan",
      "url": "https://reactbeginner.com/",
      "likes": 10,
      "user": "63075a5f9f7efed091c3ba61"
    }
  ]

  const usersinDB =(async () =>{
    initUser.forEach( async(u) => {
      let temp = new User({
        _id:u._id,
        name:u.name,
        username:u.username,
        blogs:u.blogs,
        hashPassword:await bcrypt.hash(u.password,10)
      })
       await temp.save()
    })

  })

  const blogsinDB = ( async () => {
    const blogs = await Blog.find({})
   
    return blogs.map(blog => blog.toJSON())
  })
  
  
  module.exports = { initBlog,blogsinDB,initUser,usersinDB }