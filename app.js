const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-error')

const middleware = require('./utils/middleware')
const { info,error } = require('./utils/logger')
const config = require('./utils/config')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const PORT = config.PORT 
info('Connecting to...')
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        info('connected to mongoDB')
    })
    .catch((err) => {
        error('error connecting to mongoDB: ',err.message)
    })

app.use(cors())
app.use(express.json())

app.use('/api/login',loginRouter)
app.use('/api/users',userRouter)

app.use(middleware.tokenExtractor)
app.use('/api/blogs',middleware.userExtractor,blogRouter)


app.use(middleware.errorHandler)
module.exports = app


