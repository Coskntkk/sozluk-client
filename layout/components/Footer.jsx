import React from 'react'

const Footer = ({ visible = true }) => {
    return (
        <footer className={`bg-sky-700 text-white p-4 w-screen ${visible ? "bottom-0 fixed " : "invisible"}`}>
            <div className="container">
                <p>&copy; 2024 Sozluk</p>
            </div>
        </footer>
    )
}

export default Footer