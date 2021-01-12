const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)
  })
  
blogRouter.post('/', async(request, response) => {
    const body = request.body
    const users = await User.find({})
    const user = users[0]

    if(!body.likes){
      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: 0,
        user:user._id
      }

      const blog = new Blog(newBlog)
  
      const result = await blog.save()
      response.status(201).json(result)  
    }
    else if(!body.title && !body.url){
      return response.status(400).json({
        error: 'title & url are missing'
      })
    }
    else{
      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user:user._id
      }
      const blog = new Blog(newBlog)
      const result = await blog.save()

      user.blogs = user.blogs.concat(result._id)
      await user.save()
      
      response.status(201).json(result)  
    }

  })

blogRouter.delete('/:id', async(request, response) => {

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async(request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.json(updatedBlog)
})
  

  module.exports = blogRouter