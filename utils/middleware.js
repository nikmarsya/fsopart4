const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = {
    errorHandler  : (error, request, response, next) => {
    
                if (error.name === 'CastError') {
                    return response.status(400).send({ error: 'malformatted id' })
                } else if (error.name === 'ValidationError') {
                    return response.status(400).json({ error: error.message })
                } else if (error.name === 'MongoServerError') {
                return response.status(400).json({ error: error.message })
            }
                
                next(error)
                },
    tokenExtractor  : (req,res,next) => {
                    const authorization = req.get('Authorization')
                    
                    if(authorization && authorization.toLowerCase().startsWith('bearer '))
                        req.token = authorization.substring(7)
                    else
                       return res.status(401).json({error:'Unauthorized'})
                    next()
                    },
    userExtractor   : async (req,res,next) => {
                    const authorization = req.get('Authorization')
                    let token = null
                    if(authorization && authorization.toLowerCase().startsWith('bearer '))
                        token = authorization.substring(7)
                    
                    const decodedToken = jwt.verify(req.token,process.env.SECRET)
                    const user = await User.findById(decodedToken.id)
                    req.user = user
                    next()
                    }

}

