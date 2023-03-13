import React from 'react'

const Part = ({ parts, exercises }) => {
    console.log(parts, exercises);

    return (

        <p>{parts}-{exercises}</p>

    )
}

export default Part;