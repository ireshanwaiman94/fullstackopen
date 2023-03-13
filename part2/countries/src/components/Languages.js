const Languages = ({ name, flag }) => {
    console.log("flag", flag)
    return (
        <div>
            <ul>
                <li key={name}>{name}</li>
            </ul>

        </div>
    )
}
export default Languages