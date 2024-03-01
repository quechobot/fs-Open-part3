const express = require('express')
const morgan = require('morgan')
const app = express()
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
const cors = require('cors');
app.use(cors());
app.use(requests);
app.use(express.static('dist'))
app.use(express.json());
const generateId = (max) => Math.floor(Math.random() * max);
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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
    if(persons.find((person)=> person.name.toLowerCase()===body.name.toLowerCase())){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(100000000000000000000000000000000000000000000000000000000),
    }
    persons = persons.concat(person)
    response.json(persons)
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    personDeleted = persons.find(person => person.id ===id);
    persons = persons.filter(person => person.id !== id)
    response.json (personDeleted);
})
app.put('/api/persons/:id', (request, response) => {
    response.status(405).send({error: 'Method Not Allowed'});
})
app.get('/info', (request, response)=>{
    const date = new Date().toUTCString();
    const info =`
        <p>phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `
    response.send(info)
})
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})