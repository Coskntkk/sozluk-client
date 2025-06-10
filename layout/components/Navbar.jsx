import React from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    return (
        <header className="bg-sky-700 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href={"/"}>
                    <h1 className="text-2xl font-bold">📖 Sözlük</h1>
                </Link>
                {isAuthenticated
                    ? (
                        <div className="flex space-x-4">
                            <nav>
                                <ul className="flex space-x-4">
                                    <li><Link href={`/u/${user.username}`}>🫵 {user.username}</Link></li>
                                </ul>
                            </nav>
                            <nav>
                                <ul className="flex space-x-4">
                                    <li><Link href="/auth/login">🚪 Logout</Link></li>
                                </ul>
                            </nav>
                        </div>
                    )
                    : (
                        <nav>
                            <ul className="flex space-x-4">
                                <li><Link href="/auth/login">🚪 Login</Link></li>
                                <li><Link href="/auth/register">✍️ Register</Link></li>
                            </ul>
                        </nav>
                    )
                }
            </div>
        </header>
    )
}

export default Navbar