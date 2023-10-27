import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import usePermissions from './General/usePermissions';
import useRoles from './General/useRoles';

const useRolesAndPermissions = () => {
    const router = useRouter();
    const { roleId } = router.query;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getRole, updateRolePermissions } = useRoles();
    const { getAllPermissions } = usePermissions()
    const [role, setRole] = useState({ organizedPermissions: [], permissions: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedRole = await getRole(roleId);
                const fetchedPermissions = await getAllPermissions();
                const rolePermissionIds = fetchedRole.permissions.map(permission => permission.id); // Crear una lista plana de IDs de permisos para el rol
                const organizedPermissions = fetchedPermissions.reduce((acc, permission) => {
                    const [moduleName, permissionName] = permission.name.split('.');
                    if (!acc[moduleName]) {
                        acc[moduleName] = [];
                    }
                    acc[moduleName].push({
                        id: permission.id,
                        name: permissionName,
                        assigned: rolePermissionIds.includes(permission.id), // Determinar si el permiso está asignado al rol
                    });
                    return acc;
                }, {});

                setRole({
                    id: fetchedRole.id,
                    name: fetchedRole.name,
                    organizedPermissions: organizedPermissions,
                    permissions: fetchedRole.permissions,
                });
            } catch (error) {
                setError('Error al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        if (roleId) {
            fetchData();
        }
    }, [roleId]);

    const handlePermissionChange = async (moduleId, permissionId, isChecked, permissionName) => {
        try {
            if (role.name === 'administrador' && `${moduleId}.${permissionName}` === 'General.administrar_usuarios_y_permisos') {
                throw new Error('No puedes cambiar este permiso para el rol administrador.');
            }
            if (!role || !Array.isArray(role.permissions)) return;

            // Crear una copia del array de permisos y de organizedPermissions
            const updatedPermissions = [...role.permissions];
            const updatedOrganizedPermissions = { ...role.organizedPermissions };

            // Buscar el permiso basado en su id y el módulo
            const existingPermissionIndex = updatedPermissions.findIndex(
                perm => perm.id === permissionId && perm.name.startsWith(moduleId)
            );

            // Actualizar el estado de 'assigned' en organizedPermissions
            const permissionInModule = updatedOrganizedPermissions[moduleId].find(
                perm => perm.id === permissionId
            );
            permissionInModule.assigned = isChecked;

            if (isChecked && existingPermissionIndex === -1) {
                updatedPermissions.push({
                    id: permissionId,
                    name: `${moduleId}.${permissionName}`,
                });
            } else if (!isChecked && existingPermissionIndex !== -1) {
                updatedPermissions.splice(existingPermissionIndex, 1);
            }

            await updateRolePermissions(roleId, { id: role.id, permissions: updatedPermissions });

            // Actualizar el estado local con el nuevo array de permisos y organizedPermissions
            setRole(prevRole => ({
                ...prevRole,
                permissions: updatedPermissions,
                organizedPermissions: updatedOrganizedPermissions
            }));

            toast.success(`Permiso: ${permissionName} ${isChecked ? 'activado' : 'desactivado'} correctamente.`, {
                icon: isChecked ? "✅" : "❌",
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } catch (error) {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    return {
        error,
        loading,
        role,
        handlePermissionChange,
    };
};

export default useRolesAndPermissions;
