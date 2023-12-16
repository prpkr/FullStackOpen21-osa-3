const express = require("express");
const morgan = require("morgan"); //Morgan midlleware tehtävä 3.7
const cors = require('cors')  // Cross-origin resource sharing tehävä 3.9


const app = express();

app.use(express.json())
app.use(cors())

//3.8 Custom token for POST-requests
morgan.token('post-data', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));


// 3.1 list persons
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


app.get("/", (req, res) => {
  res.send("<h1>Hello Phonebook!</h1>");
});

//Persons End point
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// 3.2 Info page
function getCurrentDateTime() {
  const currentDateTime = new Date();
  return currentDateTime.toLocaleString();
}

const infoHtml = `
  <h2>Phonebook has info for ${persons.length} people.</h2>
  <h2>${getCurrentDateTime()}</h2>
`;

// Info End point
app.get("/info", (req, res) => {
  res.send(infoHtml);
});

//3.3 person End point
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  //3.4 Delete person
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  //3.5-6 Post person

  //Generate new ID
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0;
    return maxId + 1;
  };

  // Check for person name in persons
  const nameExists = (name) => {
    return persons.some(p => p.name === name);
  };
  

  
  app.post('/api/persons', (request, response) => {
    // Extract and destructure name and number from request body.
    const { name, number } = request.body;

    if (!name || !number) {
      // Send a 400 Bad Request response with a custom error message
      return response.status(400).send({ error: 'Name or number is missing' });
    }

    if (nameExists(name)) {
      return response.status(400).send({ error: 'Name already exists in the phonebook' });
    }

    //Create person
    const person = {
      name,
      number,
      id: generateId()
    };

    //Add person to persons
    persons.push(person);
    response.json(person);
  });
  
  

//Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
