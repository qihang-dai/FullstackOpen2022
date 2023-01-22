require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

// eslint-disable-next-line no-unused-vars
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})


app.get('/info', (request, response) => {
    Person.find({}).then(result => {
        response.send(`<p>Phonebook has info for ${result.length} people</p><p>${new Date()}</p> ${response.json(result)}`)
    })
})

app.get('/api/persons/:id', (request, response,next) => {
    Person.findById(request.params.id).then(person => {
    if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }
    ).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
    Person.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body
    if (!name || !number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const person = new Person({
        name,
        number,
    })
    person.save().then(result => {
        response.json(result)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    const person = {
        name,
        number
    }
    Person
        .findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`port: ${PORT}, uri: ${process.env.MONGODB_URI}`)
})