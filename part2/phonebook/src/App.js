import { useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import React from 'react' 
import Countries from './components/Countries'
import phonebookService from './service/phonebookService'
import Notification from './components/ErrorNotification'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState("some error may be here")


  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const filterPersons = (event) => {
    event.preventDefault()
    setFilter(event.target.value)
    setShowAll(false)
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id : newName
    }
    
    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
        phonebookService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          })
          .catch(error => {
            setMessage(
              `Information of ${person.name} has already been removed from server, Error: ${error.message}`
            )
          })
      } 
    } else {
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        }).catch(error => {
          setMessage(
            `Error: ${error.response.data.error} Message: ${error.message}}`
          )
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService
        .deletePerson(id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const Footer = () => {
    const footerStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16
    }
    return (
      <div style={footerStyle}>
        <br />
        <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
      </div>
    )
  }
  

  // Countries part

  const [countries, setCountries] = useState([])
  const [filter2, setFilter2] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [showAllCountries, setShowAllCountries] = useState(true)
  const filterCountry = (event) => {
    event.preventDefault()
    setFilter2(event.target.value)
    setShowAllCountries(false)
    setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }


  useEffect(() => {
    console.log('effect')
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        console.log('country promise fulfilled')
        if (response.data.length > 0) {
          setCountries(response.data)
        } else {
          setCountries([])
        }
      })
  }, [])

  return (
    <div>
      <h2> Notification</h2>
      <Notification message={message} />
      <h2> Countries</h2>
      <Filter text="filter countries" filter={filter2} onChange={filterCountry} />
      <Countries countries={filteredCountries} filter={filter2} handleShowClick = {setFilteredCountries} />
      <h2>Phonebook</h2>
      <Filter text = "filter person" filter={filter} onChange={filterPersons} />
      <h2>Add a new </h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} showAll={showAll} filteredPersons={filteredPersons} handleDelete = {handleDelete} />
      <Footer />
    </div>
  )
}

export default App