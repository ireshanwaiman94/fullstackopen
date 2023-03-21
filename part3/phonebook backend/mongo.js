const mongoose = require('mongoose')

const username = process.argv[2]
const password = process.argv[3]
const personName = process.argv[4]
const personNumber = process.argv[5]

const url = `mongodb+srv://${username}:${password}@cluster0.lo8mi.mongodb.net/phonebookApp?retryWrites=true&w=majority`
// gyNpwlvcJmVqqD66
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: personName,
    number: personNumber,
})

person.save().then(person => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
})

Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
})