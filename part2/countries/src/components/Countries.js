import { useState, useEffect } from 'react';
import CountryInfor from './CountryInfor'
import axios from 'axios'
const Countries = ({ countries, setFilterCountries }) => {

    if (countries.length > 10) {
        return "Too many matches, specify another filter"
    } else if (countries.length === 1) {
        console.log("countries length", countries[0])
        return (
            <div>
                <CountryInfor country={countries[0]} />
            </div>
        )
    }

    return (
        <ul>
            {
                countries.map((country, i) => (
                    <li key={country.numericCode}>{country.name}<button onClick={() => setFilterCountries([country])}>Show</button></li>
                ))
            }
        </ul>
    )
}
export default Countries