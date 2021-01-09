const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const { init } = require('../models/blog')

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

test('verify unique identifier is id', async() => {

     const response = await api.get('/api/blogs')
     const blogs = response.body.map(b => b)
     expect(blogs[0].id).toBeDefined()
})

test('verify creation of new blog', async() => {
    const newBlog = {
        title: "Testin express apps",
        author: "Crissy",
        url: "app.JS.io",
        likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs') 
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    expect(titles).toContain(
        "Testin express apps"
    )


})

test('verify blog is assigned 0 likes if likes are missig', async() => {
  const newBlog = {
    title: "Clean code ",
    author: "Crissy",
    url: "app.JS.io"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const likes = response.body.map(b => b.likes)

  expect(likes).toContain(0)

})

test('return 400 if url and title are missing', async () => {
  const newBlog = {
    author: "Joram",
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

})

test('verify blog is removed on deletion', async () => {
  const blogs = await api.get('/api/blogs')
  const blogToDelete = blogs.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length - 1)  

})

test('verify blog is can be updated', async() => {
  const blogs = await api.get('/api/blogs')
  const blogToUpdate = blogs.body[0]

  const update = {
    title: "Node JS",
    author: "Joram",
    url: "12-477887655-0",
    likes: 100
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(update)
    .expect(200)

  const response = await api.get('/api/blogs')
  const likes = response.body.map(b => b.likes)

  expect(likes).toContain(100)
  expect(likes).toHaveLength(initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})