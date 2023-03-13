const Total = ({ parts }) => {
    console.log("Total", parts);

    const totalAmount = parts.reduce((sum, parts) => {
        return sum += parts.exercises;
    }, 0)
    return (
        <p><b>total of {totalAmount} exercises </b> </p>
    )
}

export default Total;