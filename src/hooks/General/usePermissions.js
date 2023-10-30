import axios from '@/lib/axios'
import { useEffect, useState } from 'react'

const usePermissions = () => {
    const [permissions, setPermissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const getAllPermissions = async () => {
        try {
            await csrf()
            setLoading(true)
            const response = await axios.get(`/api/permissions`)
            setPermissions(response.data)
            return response.data
        } catch (error) {
            console.error('Error al obtener todos los permisos', error)
            setError('Error al obtener todos los permisos')
        } finally {
            setLoading(false)
        }
    }

    const addPermission = async permission => {
        try {
            await csrf()
            setLoading(true)
            const response = await axios.post(`/api/permissions`, permission)
            return response.data
        } catch (error) {
            console.error('Error al crear el permiso', error)
            setError('Error al crear el permiso')
            // throw error; // Lanza el error para que pueda ser manejado en el componente que utiliza este hook
        } finally {
            setLoading(false)
        }
    }

    const deletePermission = async permissionId => {
        try {
            await csrf()
            setLoading(true)
            const response = await axios.delete(
                `/api/permissions/${permissionId}`,
            )
            return response.data
        } catch (error) {
            console.error('Error al eliminar el permiso', error)
            setError('Error al eliminar el permiso')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllPermissions()
    }, [])

    return {
        permissions,
        loading,
        error,
        getAllPermissions,
        addPermission,
        deletePermission,
    }
}

export default usePermissions
