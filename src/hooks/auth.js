import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    //  obtengo la información del usuario autenticado desde la ruta /api/user de la API
    const { data: userData, error, mutate, isValidating } = useSWR(
        '/api/user',
        () =>
            axios
                .get('/api/user')
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/verify-email')
                }),
    )

    const user = userData?.user // Extrae el usuario de userData
    const permissions = userData?.permissions || [] // Extrae los permisos de userData, por defecto será un array vacío si no hay permisos

    // Obtengo los usuario con su rol
    const getUsersWithRole = async () => {
        try {
            const res = await axios.get('/api/users-with-roles')
            return res.data
        } catch (error) {
            // console.error(error)
            throw error
        }
    }

    // const updateUserPermissions = async (userId, permissions) => {
    //     try {
    //         await csrf();  // Obtener el token CSRF antes de hacer la petición
    //         const response = await axios.post(`/api/users/${userId}/sync-permissions`, permissions);
    //         return response.data; // Puedes retornar los datos de respuesta si lo necesitas
    //     } catch (error) {
    //         console.error('Error al actualizar los permisos del usuario', error);
    //         throw error; // Lanza el error para que pueda ser manejado en el componente que utiliza este hook
    //     }
    // }

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: router.query.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        isLoading: isValidating,
        permissions,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        getUsersWithRole,
        // updateUserPermissions,
    }
}
