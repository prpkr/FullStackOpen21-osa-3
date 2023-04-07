const express = require("express");
const app = express();

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

//Hello
app.get("/", (req, res) => {
  res.send("<h1>Hello Phonebook!</h1>");
});

//Info
function getCurrentDateTime() {
  const currentDateTime = new Date();
  return currentDateTime.toLocaleString();
}

const infoHtml = `
  <h2>Phonebook has info for ${persons.length} people.</h2>
  <h2>${getCurrentDateTime()}</h2>
`;

app.get("/info", (req, res) => {
  res.send(infoHtml);
});

//Persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

//Person Id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  //Delete
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

//PORT
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
