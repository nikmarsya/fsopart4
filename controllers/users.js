const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')



//create new user
usersRouter.post('/', async (req,res,next) => {
    const { username,name,password } = req.body 
   
    if(password.length<3)
        return res.status(400).json({error: 'password must be longer than 3 characters'})

    const salt = 10
    const hashPassword = await bcrypt.hash(password,salt)
   
    const newUser = new User({
        name,
        username,
        hashPassword
    })

    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
       
    }catch(err){
        next(err)
    }
})

//list all users with their blog entries
usersRouter.get('/', async (req,res) => {
    const result = await User.find({}).populate('blogs',{url:1,title:1,author:1})
    res.json(result)
    
})

//update list of blogs ********* find other things to update
usersRouter.put('/:id', async (req,res) => {
    const body =req.body
   
    const user = await User.findById(req.params.id)
    const updateUser = {
        blogs:[...user.blogs,body.blogs]
    }

    const result = await User.findByIdAndUpdate(req.params.id,updateUser,{new:true})
    res.json(result)


})

module.exports = usersRouter