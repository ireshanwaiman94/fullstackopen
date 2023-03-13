const Person = ({ persons, queary, deletePerson }) => {

    return (
        <div>
            {
                persons.filter(person => person.name.toLowerCase().includes(queary)).map(person => (

                    <div key={person.id}>{person.name} {person.number}<button onClick={() => deletePerson(person.id)}>delete</button></div>

                ))
            }
        </div>
    )
}

export default Person;