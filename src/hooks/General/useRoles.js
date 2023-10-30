import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'

const useRoles = () => {
    const [roles, setRoles] = useState([])
    const [rolesWithPermissions, setRolesWithPermissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [paginationData, setPaginationData] = useState({
        total: 0,
        perPage: 10,
        currentPage: 1,
        lastPage: 0,
        orderBy: 'desc',
        column: 'id',
    })

    const [filterData, setFilterData] = useState({
        moduleId: '',
        username: '',
    })

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const fetchRoles = async () => {
        try {
            setLoading(true)
            const fetchedRoles = await axios.get(`/api/roles`)
            const { data } = fetchedRoles
            setRoles(data.result.data)
        } catch (error) {
            setError('Error al cargar los roles')
        } finally {
            setLoading(false)
        }
    }

    // Obtengo los roles con sus permisos
    const fetchRolesWithPermissions = async (
        currentPage,
        perPage = 10,
        column = 'id',
        orderBy = 'desc',
    ) => {
        try {
            setLoading(true)
            const fetchedRoles = await axios.get(
                `/api/roles?current_page=${currentPage}&per_page=${perPage}&order_by=${orderBy}&column=${column}&moduleId=${filterData.moduleId}`,
            )
            const { data } = fetchedRoles
            setRolesWithPermissions(data.result.data)
            setPaginationData(prevData => ({
                ...prevData,
                total: data.result.total,
                perPage: data.result.perPage,
                currentPage: data.result.currentPage,
                lastPage: data.result.lastPage,
            }))
        } catch (error) {
            setError('Error al cargar los roles')
        } finally {
            setLoading(false)
        }
    }

    const changeSorting = newColumn => {
        setPaginationData(prevData => ({
            ...prevData,
            column: newColumn === prevData.column ? prevData.column : newColumn,
            orderBy:
                newColumn === prevData.column
                    ? prevData.orderBy === 'asc'
                        ? 'desc'
                        : 'asc'
                    : 'desc',
        }))
    }

    const handleFilter = e => {
        e.preventDefault()
        fetchRolesWithPermissions(
            1,
            paginationData.perPage,
            paginationData.column,
            paginationData.orderBy,
        )
    }

    const getRole = async roleId => {
        try {
            // await csrf();  // Obtener el token CSRF antes de hacer la petición
            const response = await axios.get(`/api/roles/${roleId}`)
            return response.data // Puedes retornar los datos de respuesta si lo necesitas
        } catch (error) {
            console.error('Error al obtener el rol por su id', error)
            throw error
        }
    }

    const deleteRole = async roleId => {
        const isConfirmed = window.confirm(
            '¿Estás seguro de que deseas eliminar este rol? Se eliminará el rol y se revocarán los permisos asociados al mismo.',
        )

        if (!isConfirmed) return

        try {
            // await csrf();  // Obtener el token CSRF antes de hacer la petición
            const response = await axios.delete(`/api/roles/${roleId}`)
            toast.success(response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar',
            })
            setRolesWithPermissions(prevRoles =>
                prevRoles.filter(role => role.id !== roleId),
            )
        } catch (error) {
            const backendMessage =
                error.response &&
                error.response.data &&
                error.response.data.message
                    ? error.response.data.message
                    : 'Error desconocido'
            toast.error(backendMessage, {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar',
            })
        }
    }

    const addRoleWithPermissions = async (name, permissions = {}) => {
        try {
            // await csrf();
            setLoading(true)
            const response = await axios.post(`/api/roles`, {
                name,
                permissions,
            })
            // Actualizar roles en el estado
            setRolesWithPermissions(prevRoles => [
                response.data.role,
                ...prevRoles,
            ]) // Asumiendo que el nuevo rol se devuelve en la respuesta como response.data.role
            return response.data
        } catch (error) {
            throw error // Lanza el error para que pueda ser manejado en el componente que utiliza este hook
        } finally {
            setLoading(false)
        }
    }

    const updateRolePermissions = async (roleId, updatedRole) => {
        try {
            // await csrf();  // Obtener el token CSRF antes de hacer la petición
            const response = await axios.put(
                `/api/roles/${roleId}/permissions`,
                updatedRole,
            )
            return response.data // Puedes retornar los datos de respuesta si lo necesitas
        } catch (error) {
            console.error('Error al actualizar el rol', error)
            throw error // Lanza el error para que pueda ser manejado en el componente que utiliza este hook
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    useEffect(() => {
        fetchRolesWithPermissions(
            paginationData.currentPage,
            paginationData.perPage,
            paginationData.column,
            paginationData.orderBy,
        )
    }, [
        paginationData.column,
        paginationData.orderBy,
        paginationData.currentPage,
        paginationData.perPage,
    ])

    return {
        roles,
        loading,
        error,
        rolesWithPermissions,
        filterData,
        setFilterData,
        handleFilter,
        changeSorting,
        getRole,
        paginationData,
        setPaginationData,
        deleteRole,
        addRoleWithPermissions,
        updateRolePermissions,
    }
}

export default useRoles
