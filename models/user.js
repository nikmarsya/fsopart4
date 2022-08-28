const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        minLength:3,
        unique:true,
        required:true,
    },
    name:String,
    hashPassword: {
        type:String,
        required:true
    },
    blogs: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog'
        }
    ]
    

})

userSchema.set('toJSON',{
    transform: (doc,returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
        delete returnedObj.hashPassword
        delete returnedObj.entries
    }
})

module.exports = mongoose.model('User',userSchema)