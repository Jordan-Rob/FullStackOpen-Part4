const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

const usersInDB = async() => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

describe('when theres initially one user in db', () => {
    beforeEach = async() => {
        await User.deleteMany({})
    
        const passwordHash = bcrypt.hash('secret', 10)
        const user = new User({username:'root', password:passwordHash})
        await user.save()
    }
    
    test('a new user is created and added to db', async() => {
        const usersAtStart = await usersInDB()
    
        const newUser = {
            username:'spiderman',
            name:'miles morales',
            password:'amazing'
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
    
        const usersAtEnd = await usersInDB()
        const usernames = usersAtEnd.map(users => users.username) 
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        expect(usernames).toContain(newUser.username)
        
    })

    test('all users can be retrieved', async() => {
        await api
        .get('/api/users')
        .expect(200)
    })
    
})

afterAll(() => {
    mongoose.connection.close()
})
