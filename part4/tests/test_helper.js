const Blog = require('../models/blog')
const blog_data = require('./blog_data.js')

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    blogsInDb, blog_data
}