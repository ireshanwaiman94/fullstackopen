require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


const Person = require('./models/Person')

morgan.token('body', (req) => JSON.stringify(req.body))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const generateId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return randomNumber;
}

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
    const personsCount = Person.length
    const currentDate = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const formattedDate = currentDate.toLocaleString('en-US', options);
    const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    response.send(`<p>Phone book has info for ${personsCount} peoples <br><br> ${formattedDate} (${timezoneName})</p>`)

})
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(400).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    console.log("Generate ID", generateId())
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({
            error: "name is missing"
        })
    } else if (body.number === undefined) {
        return response.status(400).json({
            error: "number is missing"
        })
    }

    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })
    //Save data to database
    person.save().then(savedPerson => {
        console.log("persons", savedPerson)
        response.json(savedPerson)
    }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    // const body = request.body
    const { name, number } = request.body

    // const person = {
    //     name: body.name,
    //     number: body.number
    // }

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
