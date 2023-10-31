import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import Link from 'next/link'

const AccessDenied = () => {
    return (
        <AppLayout>
            <div className="py-6 px-8 bg-gray-100">
                <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="text-center">
                            <svg
                                className="w-16 h-16 text-red-600 mx-auto mb-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 2a8.002 8.002 0 0013.856-.018M4 7h16M4 7L5.245 5.38a2 2 0 011.962-.38h10.586a2 2 0 011.962.38L20 7M4 7l1.649-3.905A2 2 0 017.176 2h9.648a2 2 0 011.527.905L20 7"
                                />
                            </svg>
                            <h3 className="font-bold text-2xl mb-4">
                                ¡Oops! No tienes permisos para acceder a esta
                                página.
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Si crees que es un error, comunícate con el
                                administrador o intenta regresar al{' '}
                                <Link href="/dashboard">
                                    <a className="text-blue-600 hover:underline">
                                        inicio
                                    </a>
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default AccessDenied
