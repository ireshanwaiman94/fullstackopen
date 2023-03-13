import Languages from './Languages'
import Weather from './Weather'

const CountryInfo = ({ country }) => {
    console.log("country", country);
    return (
        <div>
            <h1>{country.name}</h1>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages</h3>
            <ul>
                {country.languages.map(language =>

                    <Languages name={language.name} />

                )}
            </ul>
            <img src={country.flag} alt={country.name} width="150" height="150" />
            <Weather countryName={country.name} />
        </div>

    )
}
export default CountryInfo