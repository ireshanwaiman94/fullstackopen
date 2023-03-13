import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'

function App() {
  const [countries, setCountries] = useState('')
  const [allCountries, setallCountries] = useState([])
  const [filterCountries, setFilterCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setallCountries(response.data)
        console.log("response", response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setCountries(event.target.value)
    const filteredCountries = allCountries.filter(country => country.name.toLowerCase().includes(countries.toLowerCase()))
    setFilterCountries(filteredCountries)
    console.log("filteredCountries", filteredCountries)
  }

  return (
    <div>
      <Filter value={countries} onChange={handleFilterChange} />
      <Countries countries={filterCountries} setFilterCountries={setFilterCountries} />
    </div>
  );
}

export default App;
