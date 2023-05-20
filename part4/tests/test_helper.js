const Blog = require('../models/blog')



const initialBlogs = [
    {
        title: "Facebook",
        author: "Mark Zuckerberg",
        url: "https://www.facebook.com/",
        likes: 40,
    },
    {
        title: "YouTube",
        author: "Jawed Karim",
        url: "https://www.youtube.com/",
        likes: 50,
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}