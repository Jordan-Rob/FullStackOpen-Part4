const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:String,
    name:String,
    password:String
})

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