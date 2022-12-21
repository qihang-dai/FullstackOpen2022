import { useState, useEffect} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'
import React from 'react' 
import Countries from './components/Countries'

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


  useEffect(() => {
    console.log('effect')
    axios.get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        if (response.data.length > 0) {
          setPersons(response.data)
        } else {
          setPersons([])
        }
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
      id : persons.length + 1
    }
    
    if (persons.find(person => person.name === newName)) {
      alert(`this name ${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }


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
      <h2> Countries</h2>
      <Filter text="filter countries" filter={filter2} onChange={filterCountry} />
      <Countries countries={filteredCountries} filter={filter2} handleShowClick = {setFilteredCountries} />
      <h2>Phonebook</h2>
      <Filter text = "filter person" filter={filter} onChange={filterPersons} />
      <h2>Add a new </h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} showAll={showAll} filteredPersons={filteredPersons} />
    </div>
  )
}

export default App