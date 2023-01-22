const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
  .then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token
  const id = request.user
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const user = request.user

  const blog= await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).json({ message: 'blog deleted' })
  } else {
    response.status(401).json({ error: 'user not authorized to delete this blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const id = request.params.id
  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
  response.json(updatedBlog)
})


module.exports = blogsRouter