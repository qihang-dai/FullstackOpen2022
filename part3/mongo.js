const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const url =
  'mongodb+srv://mongodb:mongodb@cluster0.o917bi0.mongodb.net/phonebook?retryWrites=true&w=majority'

mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Note', PersonSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} 
else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('Please provide the password and name and number as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}


