const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe("login validation", () => {
    test("password should be longer than 3 characters", () => {
        const user = {
            username: "test",
            password: "te"
        }
        api.post("/api/login").send(user).expect(400)
    }
    )
    test("username should be longer than 3 characters", () => {
        const user = {
            username: "te",
            password: "test"
        }
        api.post("/api/login").send(user).expect(400)
        }
    )
})

afterAll(() => {
    mongoose.connection.close()
})