import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

const AddRoleModalModule = ({
    name,
    permissions,
    onToggle,
    isOpen,
    deletePermission,
    fetchData,
    isAdmin,
    handleCheckboxChange,
}) => {
    const handleDeletePermission = async (permissionId) => {
        try {
            const isAdminUserAndPermissions = (permissionId === 1 && isAdmin);

            if (isAdminUserAndPermissions) {
                toast.error('No se puede eliminar el permiso para el usuario administrador.', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                return;
            }
            await deletePermission(permissionId);
            toast.success('Permiso eliminado con éxito!', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            fetchData();
        } catch (error) {
            console.error('Error al eliminar el permiso', error);
            toast.error('Error al eliminar el permiso. Por favor, intenta de nuevo.', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    return (
        <div>
            Haga click en el nombre del modulo para mostrar los pemisos:
            <div onClick={onToggle} className='cursor-pointer'>
                <span className="ml-0 inline-block bg-blue-600 text-white px-2 py-1 rounded-full text-md">{name}</span>
            </div>
            {isOpen && permissions.map(permission => (
                <label key={permission.id} className="block mb-2 items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        value={permission.name}
                        onChange={(e) => handleCheckboxChange(e, permission)}
                    />
                    <span>{permission.name}</span>
                    {permission.isNew && <span className="ml-2 inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">Nuevo</span>}
                    <button
                        onClick={() => handleDeletePermission(permission.id)}
                        className="ml-2 inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600"
                    >
                        <FontAwesomeIcon icon={faTrash} size="xs" />
                    </button>
                </label>
            ))}
        </div>
    );
}

export default AddRoleModalModule;
