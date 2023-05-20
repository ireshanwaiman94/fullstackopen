const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const url =
    `mongodb+srv://${username}:${password}@cluster0.lo8mi.mongodb.net/testBlogApp?retryWrites=true&w=majority`
// gyNpwlvcJmVqqD66
mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog(
    {
        title: "Youtube",
        author: "Jawed Karim",
        url: "https://www.youtube.com/",
        likes: 20
    }
)

blog.save().then(result => {
    console.log('blog saved!')
    mongoose.connection.close()
})
