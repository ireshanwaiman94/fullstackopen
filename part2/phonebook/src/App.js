import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterQuery, setNameFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  //Get All Persons
  useEffect(() => {
    personsService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  //Save Persons
  const addPerson = (event) => {

    // console.log("existingPersonCehck", existingPersonCehck[0]);
    event.preventDefault()
    const person = persons.filter((person) =>
      person.name === newName
    )

    const personToAdd = person[0]
    //methanata 0 th eka ganne palleha updatePerson ekata meka copy karaddi object ekak vidiyata copy karanna ona enisa arry  eke oth index eka galawala thamai  ...personToAll kiyana thanata copy wene nattam erros denawa
    console.log("personToAdd", personToAdd);
    // existingPersonCehck = persons.find(person => person.name === newName)
    const updatePerson = { ...personToAdd, number: newNumber }
    if (person.length !== 0) {

      console.log("updatePerson", updatePerson);
      if (window.confirm(`${personToAdd.name} is already added to the phonebook, replace the old number with a new one ?`)) {
        personsService
          .update(updatePerson.id, updatePerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personToAdd.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          }).catch(error => {
            setErrorMessage(`Information of '[ERROR] ${updatePerson.name}' has already been removed from the server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)

            setPersons(persons.filter(person => person.id !== updatePerson.id))
            setNewName('')
            setNewNumber('')


            console.log("Error", error)
          })
      }
    } else {
      const newPersonObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      personsService.create(newPersonObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setErrorMessage(`Added '${newPersonObject.name}'`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }).catch(error => {
          console.log("Error", error.response.data)
        })
    }
  }

  const deletePerson = (id) => {
    const filterPerson = persons.filter(person => person.id === id)
    const personName = filterPerson[0].name

    console.log("Person ID", id);
    if (window.confirm(`Delete ${personName} ?`)) {
      personsService.removePerson(id)
        .then(returnedPerson => {
          setPersons(persons.filter(person => person.id !== id))
          console.log("returnedPerson", returnedPerson);
          setErrorMessage(`the person [ERROR]'${personName}' is  deleted`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }).catch(error => {
          setErrorMessage(`[ERROR] the person '${id}' is already deleted from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          console.log("Error", error.response.data)
        })
    }
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter value={filterQuery} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber}
        handleChangeName={handleNameChange} handleChangeNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <Person persons={persons} queary={filterQuery} deletePerson={deletePerson} />
    </div >
  )
}

export default App;
