const jwt = require('jsonwebtoken')
const bycrpt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

//login
loginRouter.post('/', async (req,res) => {
    const { username,password } = req.body
    
    const user = await User.findOne({username})
   
    const passCorrect = user === null? false: await bycrpt.compare(password,user.hashPassword)

    if(!(user && passCorrect ))
        return res.status(401).json({error:'invalid username or password'})   
    
    const userToken = {
        username:user.username,
        id:user._id
    }

    const token = jwt.sign(userToken,process.env.SECRET)

    res.status(200)
    .send({token,  username:user.username, name:user.name})

})

module.exports = loginRouter