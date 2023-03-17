const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const generateId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return randomNumber;
}

app.get('/info', (request, response) => {
    const personsCount = persons.length
    const currentDate = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const formattedDate = currentDate.toLocaleString('en-US', options);
    const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    response.send(`<p>Phone book has info for ${personsCount} peoples <br><br> ${formattedDate} (${timezoneName})</p>`)

})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id !== id)
    console.log("Delete", person)
    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    console.log("Generate ID", generateId())
    const body = request.body
    console.log("body ", body.name)

    const existingPerson = persons.find(person => person.name === body.name)
    if (!body.name) {
        return response.status(400).json({
            error: "name is missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number is missing"
        })
    } else if (existingPerson !== undefined) {
        console.log("existingPerson", existingPerson)
        return response.status(400).json({
            error: 'name must be unique'
        })

    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    console.log("persons", persons)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})