import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftFrame from './components/LeftFrame';
const Layout = ({ children }) => {
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
                        {/* <LeftFrame /> */}
                    </div>
                </section>
                <Footer visible={false} />
            </main >
            <Footer />
        </>
    );
};
export default Layout;