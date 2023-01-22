const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const {blog_data, blogsInDb} = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blog_data)
})



test("blog are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    }
)

test(`blog has id property`,async () => {
    const response = await api.get('/api/blogs')
    
    const id = response.body[0].id
    expect(id).toBeDefined()
})

test(`blog can be added`, async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://test.com",
        likes: 0
    }
    await api.post('/api/blogs').send(newBlog).expect(201)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blog_data.length + 1)
    
    const contents = blogsAtEnd.map(n => n.title)
    expect(contents).toContain("Test Blog")
})


test(`blog without likes property defaults to 0`, async () => {
    const newBlog = {
        title: "Test Blog",
        author: "Test Author",
        url: "http://test.com"
    }
    await api.post('/api/blogs').send(newBlog).expect(201)
    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === "Test Blog")
    expect(addedBlog.likes).toBe(0)
})

test(`blog without title and url is not added`, async () => {
    const newBlog = {
        author: "Test Author",
        likes: 0
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blog_data.length)
})

describe("deletion and updating of a blog", () => {
    test(`blog can be deleted`, async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blog_data.length - 1)
        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })

    test(`blog can be updated`, async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {
            title: "Updated Blog",
            author: "Updated Author",
            url: "http://updated.com",
            likes: 0
        }
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blog_data.length)
        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).toContain(updatedBlog.title)
    })
})


afterAll(() => {
    mongoose.connection.close()
})


