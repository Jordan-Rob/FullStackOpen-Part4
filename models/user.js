const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username:{
      type:String,
      min:3,
      unique:true,
      required:true
    },
    name:String,
    password:String
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // dont return password in response
      delete returnedObject.password
    }
  })

const User = mongoose.model('User', userSchema)

module.exports = User