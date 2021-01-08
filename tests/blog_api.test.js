const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
    {
        title: "Node JS",
        author: "Joram",
        url: "12-477887655-0",
        likes: 6
    },
    {
        title: "MERN stack development",
        author: "Crissy",
        url: "app.JS.io",
        likes: 11
    }
  ]

  beforeEach(async () => {
    
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    
  })  



test('all blogs are returned on get', async() => {

    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(initialBlogs.length)
      
})

afterAll(() => {
    mongoose.connection.close()
})