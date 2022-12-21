import React from 'react'
const Persons = ({persons, showAll, filteredPersons}) => {
    return(
        <div>
        <ul>
        {showAll ? 
        persons.map(person => <li key={person.id}>{person.name} {person.number}</li>) : 
        filteredPersons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
      </ul>
        </div>
    ) 
}

export default Persons