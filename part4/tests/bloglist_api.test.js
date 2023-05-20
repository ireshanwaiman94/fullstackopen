const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../tests/test_helper')
const api = supertest(app)
const middleware = require('../utils/middleware')



let token = ''

beforeAll(async () => {
    const testUser = { username: 'testUser', password: 'password' }
    await api.post('/api/users').send(testUser)
    const responseLogin = await api.post('/api/login').send(testUser)
    token = responseLogin.body.token
}, 30000)

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are return as a JSON', async () => {
    await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('the unique identifier property of the blog posts is  by default _id ', async () => {
    const response = await
        api.get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
    expect(response.body[0].id).toBeDefined()
})

test('creates a new blog post', async () => {

    const newBlog = {
        title: "Youtube",
        author: "Steve Chen Chad Hurley",
        url: "https://youtube.com",
        likes: "200"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const title = blogsAtEnd.map(t => t.title)
    expect(title).toContain(
        'Youtube'
    )
}, 5000)

test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const newBlog = {
        title: "LinkdIn",
        author: "Johen",
        url: "https://www.linkedin.com/"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedNewBlog = blogsAtEnd.find(blog => blog.title === 'LinkdIn')
    expect(addedNewBlog.likes).toBe(0)
})

test('if the title or url properties are missing from the request data', async () => {
    const newBlog = {
        author: 'ireshan',
        likes: 10
    }

    await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('delete a blog using id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
        title: 'test',
        author: 'test',
        url: 'https://test.org/',
        likes: 1,
    }

    const postResponse = await api
        .post('/api/blogs')
        .set('authorization', `Bearer ${token}`)
        .send(newBlog)

    const blogToDelete = postResponse.body
    console.log("blogToDelete : : : : : : :", blogToDelete)
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)


    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)

}, 10000)


test('401 Unauthorized if a token is not provided', async () => {

    const newBlog = {
        title: "Youtube",
        author: "Steve Chen Chad Hurley",
        url: "https://youtube.com",
        likes: "200"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

}, 5000)


test('update the number of likes for a blog post', async () => {
    const updateBlog = {
        title: "YouTube",
        author: "Jawed Karim",
        url: "https://www.youtube.com/",
        likes: 2
    }
    const allBlogs = await helper.blogsInDb()
    const blogToUpdate = allBlogs.find(blog => blog.title === updateBlog.title)
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateBlog)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const foundBlogLike = blogsAtEnd.find(blog => blog.likes === 2)
    expect(foundBlogLike.likes).toBe(2)
})

afterAll(async () => {
    await mongoose.connection.close()
})