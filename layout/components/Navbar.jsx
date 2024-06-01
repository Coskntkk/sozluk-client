import React from 'react'
import Link from 'next/link'

const Navbar = () => {
    return (
        <header className="bg-sky-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href={"/"}>
                    <h1 className="text-2xl font-bold">Sözlük</h1>
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link href="/login">Login</Link></li>
                        <li><Link href="/register">Sign Up</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar