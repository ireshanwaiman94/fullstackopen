const Notification = ({ message }) => {
    if (message === null) {
        return null
    }


    if (message.includes('ERROR')) {
        console.log("ERROR")
        return (
            <div className="error">
                {message}
            </div>
        )
    } else {
        console.log("success")
        return (
            <div className="success">
                {message}
            </div>
        )
    }

}
export default Notification