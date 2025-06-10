import React from 'react'

const TitleHeader = ({ title }) => {
    return (
        <div className=" text-wrap p-8 mb-4 ">
            <h1 className="text-sky-500 p-1 m-0 text-start text-2xl font-bold">
                {title?.name}
            </h1>
        </div>
    )
}

export default TitleHeader