import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/auth/AuthSlice';
import { useRouter } from 'next/router';

const Navbar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        dispatch(logout({ navigate: router }))
    }

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
                                <ul className="flex space-x-4 cursor-pointer hover:underline">
                                    <li><Link href={`/u/${user.username}`}>🫵 {user.username}</Link></li>
                                </ul>
                            </nav>
                            <nav>
                                <ul className="flex space-x-4 cursor-pointer hover:underline">
                                    <li>
                                        <span
                                            onClick={() => handleLogout()}
                                        >
                                            🚪 Logout
                                        </span>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )
                    : (
                        <nav>
                            <ul className="flex space-x-4">
                                <li><Link href="/auth/login" className='cursor-pointer hover:underline'>🚪 Login</Link></li>
                                <li><Link href="/auth/register" className='cursor-pointer hover:underline'>✍️ Register</Link></li>
                            </ul>
                        </nav>
                    )
                }
            </div>
        </header>
    )
}

export default Navbar