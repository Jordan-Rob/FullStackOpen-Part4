const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)
  })
  
blogRouter.post('/', async(request, response) => {
    const body = request.body
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id){
      return response.status(401).json({
        error:'token invalid or missing'
      })
    }
    const user = await User.findById(decodedToken.id)

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
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    return response.status(401).json({
      error:'token invalid or missing'
    })
  }
  const blog = await Blog.findById(request.params.id)
  try{
    await Blog.findByIdAndRemove(blog.id)
    response.status(204).end()
  }catch(error){
    console.log(error)
    }
  
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