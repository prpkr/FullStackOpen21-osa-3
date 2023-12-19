require('dotenv').config();
const mongoose = require('mongoose')

const password = process.env.PASSWORD;
const url = process.env.DB_URL.replace('<password>', password);

mongoose.set('strictQuery', false)
mongoose.connect(url)

/* Muista:
Mongoosen dokumentaatiossa käytetään joka paikassa promisejen then-metodien sijaan takaisinkutsufunktioita, 
joten sieltä ei kannata suoraan copy-pasteta koodia*/

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

/*
const person = new Person({
  name: 'Arto Hellas3',
  number: '040-12345673'
});

person.save().then(result => {
  console.log('person saved!');
  mongoose.connection.close();
});
*/

Person.find({}).then(result => {
  result.forEach(person=> {
    console.log(person)
  })
  mongoose.connection.close()
})