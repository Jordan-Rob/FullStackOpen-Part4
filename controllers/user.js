const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async(request, response) => {
    const body = request.body

    if(body.password === undefined || body.password.length < 3){
        return response.status(400).json({
            error:'password not provided or password is less than 3 characters'
        })
    } else{
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username:body.username,
            name:body.name,
            password:passwordHash
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }
})

userRouter.get('/', async(request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

module.exports = userRouter