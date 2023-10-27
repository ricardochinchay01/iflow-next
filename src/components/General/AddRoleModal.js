import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import usePermissions from '@/hooks/General/usePermissions';
import AddRoleModalModule from './AddRoleModalModule';
import { organizePermissionsByModule } from './../../helpers'
import ValidatedInput from '../Common/ValidatedInput';

const AddRoleModal = ({
    isOpen,
    onClose,
    isAdmin,
    addRoleWithPermissions,
}) => {
    const {
        getAllPermissions,
        addPermission,
        deletePermission,
    } = usePermissions();

    const [roleName, setRoleName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [newPermission, setNewPermission] = useState("");
    const [openModules, setOpenModules] = useState({});
    const [activePermissions, setActivePermissions] = useState([]);

    const [roleNameError, setRoleNameError] = useState("");

    const fetchData = async () => {
        const fetchedPermissions = await getAllPermissions();

        const now = new Date();

        const updatedPermissions = fetchedPermissions.map(permission => {
            const permissionCreatedAt = new Date(permission.created_at);
            const timeDifference = now - permissionCreatedAt;
            const oneHour = 60 * 60 * 3000; // 3 horas

            // Si la diferencia de tiempo es menor que una 3 horas, asignamos isNew como true.
            if (timeDifference < oneHour) {
                return { ...permission, isNew: true };
            }

            return permission;
        });

        setPermissions(updatedPermissions);
    }

    const handleToggleModule = moduleName => {
        setOpenModules(prev => ({
            ...prev,
            [moduleName]: !prev[moduleName]
        }));
    };

    const organizedPermissions = organizePermissionsByModule(permissions);

    const handleAddPermission = async () => {
        if (newPermission) {
            // Validación: sin espacios y sin guion medio después del punto
            const isValid = /^[A-Z][a-zA-Z]+\.[a-zA-Z]+[^-]*$/.test(newPermission);

            if (!isValid) {
                toast.error('Formato de permiso inválido. Se debe ingresar el nombre del modulo, seguido de un punto y el nombre del permiso sin espacios.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }

            try {
                await addPermission({ name: newPermission });
                toast.success('Permiso creado con éxito!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setNewPermission("");
                fetchData();
            } catch (error) {
                // console.error('Error al agregar el permiso', error);
                toast.error('Error al crear el permiso. Por favor, intenta de nuevo.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        }
    };

    const handleCheckboxChange = (e, permission) => {
        if (e.target.checked) {
            setActivePermissions(prev => [...prev, permission.id]);
        } else {
            setActivePermissions(prev => prev.filter(id => id !== permission.id));
        }
    };

    const handleSubmit = async () => {
        // Restablece los errores
        setRoleNameError("");

        // Verificar si el nombre del rol contiene espacios
        if (/\s/.test(roleName)) {
            setRoleNameError("El nombre del rol no debe contener espacios.");
            return; // Finaliza la función aquí para que no continúe el proceso de guardar el rol
        }

        // Lógica para guardar el rol y los permisos
        try {
            // Lógica para guardar el rol y los permisos
            const response = await addRoleWithPermissions(roleName, activePermissions);

            toast.success('Rol creado con éxito!', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            onClose(); // Cierra el modal después de un éxito
        } catch (error) {
            // Verifica si error.response y error.response.data y error.response.data.errors existen antes de acceder a ellos
            const errors = error.response && error.response.data && error.response.data.errors ? error.response.data.errors : {};

            if (errors.name && errors.name.length > 0) {
                setRoleNameError(errors.name[0])
            } else {
                // Muestro cada error en un toast diferente
                Object.keys(errors).forEach((field) => {
                    toast.error(errors[field][0], {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                });
            }
        }
    };

    const handleKeyUp = (e) => {
        if (e.key === "Enter") {
            handleAddPermission();
        }
    }

    useEffect(() => {
        const closeOnEscape = (e) => {
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        }
        window.addEventListener('keydown', closeOnEscape);

        fetchData();

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white w-3/4 max-w-xl rounded p-4 z-10">
                <button onClick={onClose} className="float-right">&times;</button>
                <h2 className="text-xl mb-1">Agregar Rol</h2>
                <p className="text-xs text-gray-500 mb-2">Ingresar nombre del rol y los permisos para los distintos módulos.</p>
                <ValidatedInput
                    id="roleNameInput"
                    placeholder="Nombre del Rol"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    error={roleNameError}
                />
                <div>
                    {Object.entries(organizedPermissions).map(([moduleName, modulePermissions]) => (
                        <AddRoleModalModule
                            key={moduleName}
                            name={moduleName}
                            permissions={modulePermissions}
                            isOpen={openModules[moduleName]}
                            onToggle={() => handleToggleModule(moduleName)}
                            deletePermission={deletePermission}
                            fetchData={fetchData}
                            isAdmin={isAdmin}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                </div>

                {/* Input y botón para agregar permisos */}
                <div className="flex items-center mb-4 mt-4">
                    <div>
                        <input
                            type="text"
                            value={newPermission}
                            onChange={(e) => setNewPermission(e.target.value)}
                            onKeyUp={handleKeyUp}
                            placeholder="Nuevo permiso"
                            className="border p-2 w-3/5 h-8"
                        />
                        <button
                            onClick={handleAddPermission}
                            className="ml-2 px-4 py-1 h-8 bg-blue-900 text-white hover:bg-blue-800 rounded"
                        >
                            Guardar permiso
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Ingresar nombre del módulo seguido de un punto, sin espacios, seguido del nombre del permiso.</p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button onClick={onClose} className="bg-red-400 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-500">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-900 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-800">
                        Guardar rol
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddRoleModal;
