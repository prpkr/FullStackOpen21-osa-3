const express = require("express");
const morgan = require("morgan"); //Morgan midlleware tehtävä 3.7
const cors = require('cors')  // Cross-origin resource sharing tehävä 3.9
const Person = require('./models/person') //Eriytetty moduuli tehtävä 3.13


const app = express();

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

//3.8 Custom token for logging POST-requests
morgan.token('post-data', function (req, res) {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));


//Persons End point
app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});


// 3.2 Info End point
function getCurrentDateTime() {
  const currentDateTime = new Date();
  return currentDateTime.toLocaleString();
}

app.get('/info', (req, res) => {
  Person.countDocuments().then(count => {
    const infoHtml = `
      <h2>Phonebook has info for ${count} people.</h2>
      <h2>${getCurrentDateTime()}</h2>
    `;
    res.send(infoHtml);
  });
});


//3.3 person End point
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
});


//3.4 Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

  //3.5-6 Post person

  /* Check for person name in persons
  const nameExists = (name) => {
    return persons.some(p => p.name === name);
  };
  */
  
  app.post('/api/persons', (request, response) => {
    // Extract and destructure name and number from request body.
    const { name, number } = request.body;

    if (!name || !number) {
      // Send a 400 Bad Request response with a custom error message
      return response.status(400).send({ error: 'Name or number is missing' });
    }

    /* Toistaiseksi ei tarvi.
    if (nameExists(name)) {
      return response.status(400).send({ error: 'Name already exists in the phonebook' });
    }
    */

    //Create person
    const person = new Person({
      name,
      number,
    })

    //Add person to DB
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  });

  //PUT
  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body;
  
    const person = {
      name,
      number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

//Error handling tehtävä 3.16
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)
  

//Start server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
