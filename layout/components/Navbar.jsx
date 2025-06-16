import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/auth/AuthSlice';
import { useRouter } from 'next/router';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t } = useTranslation('navbar')
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
                    <h1 className="text-2xl font-bold">📖 Sozluk</h1>
                </Link>
                <div className="flex space-x-4 items-center">
                    <LanguageSwitcher />
                    {isAuthenticated
                        ? (<>
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
                                            🚪 {t('logout')}
                                        </span>
                                    </li>
                                </ul>
                            </nav>
                        </>
                        )
                        : (
                            <nav>
                                <ul className="flex space-x-4">
                                    <li>
                                        <Link
                                            href="/auth/login"
                                            className='cursor-pointer hover:underline'
                                        >
                                            🚪 {t('login')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/auth/register"
                                            className='cursor-pointer hover:underline'
                                        >
                                            ✍️ {t('register')}
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        )
                    }
                </div>
            </div>
        </header>
    )
}

export default Navbar