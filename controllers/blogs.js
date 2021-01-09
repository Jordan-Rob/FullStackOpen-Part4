const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
blogRouter.post('/', async(request, response) => {
    const body = request.body

    if(!body.likes){
      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: 0
      }

      const blog = new Blog(newBlog)
  
      const result = await blog.save()
      response.status(201).json(result)  
    }
    else{
      const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      }
      const blog = new Blog(newBlog)
  
      const result = await blog.save()
      response.status(201).json(result)  
    }

  })

blogRouter.delete('/:id', async(request, response) => {

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})
  

  module.exports = blogRouter