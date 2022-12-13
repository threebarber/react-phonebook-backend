const express = require("express");
var morgan = require('morgan')
const app = express();

app.use(express.json());
app.use(morgan('tiny'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${
      persons.length
    } people \n ${new Date().toLocaleString()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  try {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    };

    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "content missing",
      });
    }
    if (persons.find((person) => person.name === body.name)) {
      return response.status(400).json({
        error: `${body.name} already in phonebook`,
      });
    }

    persons = persons.concat(person);

    response.json(person);
  } catch (error) {
    return response.status(400).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
