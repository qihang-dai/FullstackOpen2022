import React from 'react'
const Persons = ({persons, showAll, filteredPersons, handleDelete}) => {
    return(
        <div>
        <ul>
        {showAll ? 
        persons.map(person => <li key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id, person.name)}>delete</button></li>): 
        filteredPersons.map(person => <li key={person.id}>{person.name} {person.number} <button onClick={() => handleDelete(person.id, person.name)}>delete</button></li>)}
      </ul>
        </div>
    ) 
}

export default Persons