const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
];

app.use(express.json());

morgan.token('sentData', (request, response) => {
    return request.method === "POST" 
    ? JSON.stringify(request.body) 
    : " ";
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :sentData"));

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        return response.json(person);
    } else {
        return response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const generateId = () => Math.floor(Math.random() * 1000000);

app.post("/api/persons", (request, response) => {
    const body = request.body;

    const existingName = persons.find(person => person.name === body.name);

    if (!body.name || !body.number) {
        const error = { error: "" };
        if (!body.name && !body.number) {
            error.error = "name and number is missing";
        } else if (!body.name) {
            error.error = "name is missing";
        } else {
            error.error = "number is missing";
        }
        return response.status(400).json(error);
    } else if (existingName) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person);

    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));