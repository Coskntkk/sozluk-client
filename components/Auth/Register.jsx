import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { register } from '@/redux/auth/AuthSlice';

const RegisterPage = () => {
    const dispatch = useDispatch();
    // const { login } = useSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().required('Required'),
            email: Yup.string().email().required('Required'),
            username: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            dispatch(register(values))
        },
    });

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-black-900 md:text-2xl">
                        Register
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Your username</label>
                            <input
                                id="username"
                                type="username"
                                name="username"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                required=""
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                required=""
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                required=""
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline ">Forgot password?</a>
                        </div>
                        <button type="submit" className="w-full text-white bg-sky-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                        <p className="text-sm font-dark text-gray-500">
                            Don’t have an account yet? <Link href="/auth/register" className="font-medium text-primary-600 hover:underline">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </section >
    )
}

export default RegisterPage

