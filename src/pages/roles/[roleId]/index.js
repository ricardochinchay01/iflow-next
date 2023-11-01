import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import AppLayout from '@/components/Layouts/AppLayout'
import ModulePermissionsCard from '@/components/General/ModulePermissionsCard'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import PermissionModal from '@/components/General/PermissionModal'
import useRoles from '@/hooks/General/useRoles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import usePermissions from '@/hooks/General/usePermissions'

const EditRole = () => {
    const router = useRouter()
    const { roleId } = router.query

    const [showModalPermission, setShowModalPermission] = useState(false)
    const [moduleSelected, setModuleSelected] = useState(false)
    const [newPermission, setNewPermission] = useState('')
    const [serverErrorsPermission, SetServerErrorsPermission] = useState({})
    const [role, setRole] = useState({
        organizedPermissions: [],
        permissions: [],
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { permissions, isLoading } = useAuth({ middleware: 'auth' })

    const { roles, getRole, updateRolePermissions } = useRoles()
    const { getAllPermissions, addPermission } = usePermissions()

    useEffect(() => {
        if (
            !isLoading &&
            !permissions.includes('General.administrar_usuarios_y_permisos')
        ) {
            router.push('/403')
        }
    }, [permissions, isLoading])

    const fetchData = async () => {
        try {
            setLoading(true)
            const fetchedRole = await getRole(roleId)
            const fetchedPermissions = await getAllPermissions()
            const rolePermissionIds = fetchedRole.permissions.map(
                permission => permission.id,
            ) // Crear una lista plana de IDs de permisos para el rol
            const organizedPermissions = fetchedPermissions.reduce(
                (acc, permission) => {
                    const [moduleName, permissionName] = permission.name.split(
                        '.',
                    )
                    if (!acc[moduleName]) {
                        acc[moduleName] = []
                    }
                    acc[moduleName].push({
                        id: permission.id,
                        name: permissionName,
                        assigned: rolePermissionIds.includes(permission.id), // Determinar si el permiso está asignado al rol
                    })
                    return acc
                },
                {},
            )

            setRole({
                id: fetchedRole.id,
                name: fetchedRole.name,
                organizedPermissions: organizedPermissions,
                permissions: fetchedRole.permissions,
            })
        } catch (error) {
            setError('Error al cargar los datos.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (roleId) {
            fetchData()
        }
    }, [roleId])

    // const { loading, error, role, setRole } = useRolesAndPermissions()

    const handlePermissionChange = async (
        moduleId,
        permissionId,
        isChecked,
        permissionName,
    ) => {
        try {
            if (
                role.name === 'administrador' &&
                `${moduleId}.${permissionName}` ===
                    'General.administrar_usuarios_y_permisos'
            ) {
                throw new Error(
                    'No puedes cambiar este permiso para el rol administrador.',
                )
            }
            if (!role || !Array.isArray(role.permissions)) return

            // Crear una copia del array de permisos y de organizedPermissions
            const updatedPermissions = [...role.permissions]
            const updatedOrganizedPermissions = { ...role.organizedPermissions }

            // Buscar el permiso basado en su id y el módulo
            const existingPermissionIndex = updatedPermissions.findIndex(
                perm =>
                    perm.id === permissionId && perm.name.startsWith(moduleId),
            )

            // Actualizar el estado de 'assigned' en organizedPermissions
            const permissionInModule = updatedOrganizedPermissions[
                moduleId
            ].find(perm => perm.id === permissionId)
            permissionInModule.assigned = isChecked

            if (isChecked && existingPermissionIndex === -1) {
                updatedPermissions.push({
                    id: permissionId,
                    name: `${moduleId}.${permissionName}`,
                })
            } else if (!isChecked && existingPermissionIndex !== -1) {
                updatedPermissions.splice(existingPermissionIndex, 1)
            }

            await updateRolePermissions(roleId, {
                id: role.id,
                permissions: updatedPermissions,
            })

            // Actualizar el estado local con el nuevo array de permisos y organizedPermissions
            setRole(prevRole => ({
                ...prevRole,
                permissions: updatedPermissions,
                organizedPermissions: updatedOrganizedPermissions,
            }))

            toast.success(
                `Permiso: ${permissionName} ${
                    isChecked ? 'activado' : 'desactivado'
                } correctamente.`,
                {
                    icon: isChecked ? '✅' : '❌',
                    position: toast.POSITION.BOTTOM_RIGHT,
                },
            )
        } catch (error) {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
            })
        }
    }

    const closeModaPermission = () => {
        setNewPermission('')
        setShowModalPermission(false)
    }

    const handleSubmitPermission = async formPermissionData => {
        try {
            const response = await addPermission({
                name: `${formPermissionData.module}.${formPermissionData.name}`,
            })
            toast.success(response.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
            })
            // setNewPermission('')
            setShowModalPermission(false)
            fetchData()
        } catch (error) {
            const errors = error.response.data.errors
            SetServerErrorsPermission(error.response.data.errors)

            // Muestro cada error en un toast diferente
            Object.keys(errors).forEach(field => {
                toast.error(errors[field][0], {
                    position: toast.POSITION.BOTTOM_RIGHT,
                })
            })
        }
    }

    if (loading)
        return (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        )
    if (error) return <p>Error: {error}</p>

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Permisos agrupados por módulo
                </h2>
            }>
            <div className="flex flex-wrap -mx-4 mt-4">
                <div className="w-full px-4">
                    <div className="text-center mx-auto mb-[60px] lg:mb-8 max-w-[510px]">
                        <h2 className="font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4">
                            Rol : {role.name}
                        </h2>
                        <p className="text-base text-body-color">
                            Para dar o revocar permisos para el rol simplemente
                            haga click sobre el nombre del permiso.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-center -mx-4 mb-1">
                {Object.entries(role.organizedPermissions).map(
                    ([moduleName, permissions]) => (
                        <ModulePermissionsCard
                            key={moduleName}
                            moduleName={moduleName}
                            permissions={permissions}
                            handlePermissionChange={handlePermissionChange}
                            setShowModalPermission={setShowModalPermission}
                            setModuleSelected={setModuleSelected}
                        />
                    ),
                )}
            </div>

            <div className="fixed bottom-4 left-4">
                {' '}
                {/* Posicionamiento en la esquina inferior izquierda */}
                <button
                    onClick={() => router.back()}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-400">
                    Volver atrás
                </button>
            </div>

            <PermissionModal
                isOpen={showModalPermission}
                onClose={closeModaPermission}
                onSubmit={handleSubmitPermission}
                initialData={{ module: moduleSelected, name: '' }}
                data={{ roles }}
                serverErrors={serverErrorsPermission}
            />

            <ToastContainer />
        </AppLayout>
    )
}

export default EditRole
