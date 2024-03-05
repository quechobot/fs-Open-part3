require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const app = express()
const Person = require('./models/person')
morgan.token('body', function (request) {
    return JSON.stringify(request.body);
});
function requests(req, res, next) {
    if (req.method === 'POST') {
        morgan(':method :url :status :res[content-length] - :response-time ms :body')(req, res, next);
    } else {
        morgan('tiny')(req, res, next);
    }
}
app.use(cors());
app.use(requests);
app.use(express.static('dist'))
app.use(express.json());
app.get('/api/persons', (request, response) => {
    Person.find({}).then(people=>{
        response.json(people)
    })
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then( person =>{
        if (person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    }).catch(error => next(error))
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number){
        return response.status(400).json({
            error:'number missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson =>{
        response.json(savedPerson)
    })
})
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            if (person){
                response.json(person)
            }else{
                response.status(404).end()
            }
        }).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response) => {
    response.status(405).send({error: 'Method Not Allowed'});
})
app.get('/info', (request, response)=>{
    const date = new Date().toUTCString();
    Person.find({}).then(people=>{
        const info =`
        <p>phonebook has info for ${people.length} persons</p>
        <p>${date}</p>`
        response.send(info)
    })
})
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})