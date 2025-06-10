import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftFrame from './components/LeftFrame';
import RightFrame from './components/RightFrame';
import { useDispatch } from 'react-redux';
import { checkLogin } from '@/redux/auth/AuthSlice';

const Layout = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkLogin())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Navbar />
            <main className='px-12'>
                <section className='flex flex-row w-100 bg-white'>
                    <div className='flex-grow w-1/5 p-2'>
                        <LeftFrame />
                    </div>
                    <div className='flex-grow w-3/5 p-2'>
                        {children}
                    </div>
                    <div className='flex-grow w-1/5 p-2'>
                        <RightFrame />
                    </div>
                </section>
                <Footer visible={false} />
            </main >
            <Footer />
        </>
    );
};
export default Layout;