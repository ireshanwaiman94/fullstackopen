const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)

})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    const user = request.user
    console.log("user#####", user)

    const blog = new Blog({
        ...body,
        user: user.id
    })

    try {
        const saveBlog = await blog.save()
        console.log("saveBlog :::::::::::", saveBlog)
        user.blogs = user.blogs.concat(saveBlog._id)
        await user.save()
        console.log(" u await user.save():::::::", await user.save())
        response.status(201).json(saveBlog)
    } catch (exception) {
        console.log('POST', exception);
        next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {

    const user = request.user
    console.log("user ####", user._id.toString());

    const blog = await Blog.findById(request.params.id)
    console.log("blog user id####", blog.user._id.toString());
    if (blog.user._id.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'Unauthorized' })
    }

})

blogsRouter.put('/:id', async (reqeust, response, next) => {
    const { title, author, url, likes } = reqeust.body
    try {
        const updateBlog = await Blog.findByIdAndUpdate(reqeust.params.id, { title, author, url, likes }, { new: true })
        response.status(200).json(updateBlog)
    } catch (exception) {
        next(exception)
    }

})
module.exports = blogsRouter