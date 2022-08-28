const Router = require('express').Router()
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

// update blog creator
Router.put('/:id', async (req,res) => {
  const decodedToken = jwt.verify(req.token,process.env.SECRET)

  if(!decodedToken.id)
    return res.status(401).json({error:'token missing or invalid'})

  const body = req.body
 
   const result = await Blog.findByIdAndUpdate(req.params.id,body,{new:true})
   res.json(result)
})

//delete blog by creator only and update user account
Router.delete('/:id',userExtractor, async (req,res) => {
    const creator = req.user
    const blog = await Blog.findById(req.params.id)
  

  
  if(blog.user.toString() === creator._id.toString()){
    const result = await Blog.findByIdAndRemove(req.params.id)
    const updateuser = await User.find({_id:creator._id})
    const updateList = updateuser.filter(blog => {
      return blog._id.toString()!==req.params.id.toString()
    }) 
    const removeBlog = await User.findByIdAndUpdate(creator._id,{blogs:updateList},{new:true})
    res.status(204).end()
  }else
  return res.status(401).json({error:'No authorization to delete this blog entry'})

})

// list all blogs with username and name of creator
Router.get('/', async (req,res) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1})
  res.status(200).json(blogs)
})
  
//create blog entry
Router.post('/',userExtractor, async (req, res) => {
    const body = req.body
      
    if(!body.title||!body.url)
    return res.status(400).json({error:'missing title or body'})

    const decodedToken = jwt.verify(req.token,process.env.SECRET)

    if(!decodedToken.id)
      return res.status(401).json({error:'token missing or invalid'})

    const user = req.user
  
    const blog = new Blog({
      title:body.title,
      url:body.url,
      author:body.author,
      likes:body.likes,
      user:user._id
    })
   
    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    res.status(201).json(result)
  })
  
module.exports = Router