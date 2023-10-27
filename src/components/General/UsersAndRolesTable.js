import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faExclamationTriangle, faArrowUp, faArrowDown, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from '@/helpers';

const UsersAndRolesTable = ({
    users,
    loading,
    error,
    paginationData,
    changeSorting,
    handleEditUser,
    toggleUserStatus,
}) => {
    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-blue-900 text-white">
                <tr>
                    <th className="py-3 px-6 text-center w-1/8">Estado</th>
                    <th className="py-3 px-6 text-center w-1/12 cursor-pointer" onClick={() => changeSorting('id')}>
                        <span className='mr-2'>Id</span>
                        {paginationData.column === 'id' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 text-center w-1/4 cursor-pointer" onClick={() => changeSorting('name')}>
                        <span className='mr-2'>Usuario</span>
                        {paginationData.column === 'name' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 w-1/8">
                        <span className='mr-2'>Rol</span>
                    </th>
                    <th className="py-3 px-6 text-center w-1/4 cursor-pointer" onClick={() => changeSorting('email')}>
                        <span className='mr-2'>Email</span>
                        {paginationData.column === 'email' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 text-center w-1/4 cursor-pointer" onClick={() => changeSorting('updated_at')}>
                        <span className='mr-2'>Última Actualización</span>
                        {paginationData.column === 'updated_at' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 text-center w-1/8">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="py-3 px-6 text-center text-gray-500">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                            No hay registros para mostrar.
                        </td>
                    </tr>
                ) : (
                    users.map((user) => {
                        return (
                            <tr key={user.id} className="border-b text-gray-700">
                                <td className="py-3 px-6 text-center">
                                    <button onClick={() => toggleUserStatus(user.id, user.deleted_at === null)}>
                                        {user.deleted_at === null ? (
                                            <FontAwesomeIcon
                                                icon={faToggleOn}
                                                style={{ fontSize: '24px' }}
                                                title="Desactivar usuario"
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faToggleOff}
                                                style={{ fontSize: '24px' }}
                                                title="Activar usuario"
                                            />
                                        )}
                                    </button>
                                </td>
                                <td className="py-3 px-6 text-center"><strong>{user.id}</strong></td>
                                <td className="py-3 px-6 text-center"><strong>{user.name}</strong></td>
                                <td className="py-3 px-6 text-center">
                                    {user.roles.length > 0 ? (
                                        <ul>
                                            {user.roles.map((role) => (
                                                <span key={role.id} className="mr-2 mb-2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs">
                                                    {role.name}
                                                </span>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>Sin rol</span>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-center"><strong>{user.email}</strong></td>
                                <td className="py-3 px-6 text-center"><strong>{formatDate(user.updated_at)}</strong></td>
                                <td className="py-3 px-6 text-center flex items-center justify-center">
                                    {user.deleted_at === null ? (
                                        <button
                                            className="text-blue-500 hover:underline mr-4"
                                            onClick={() => handleEditUser(user)}
                                            title='Editar usuario'
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        );
                    })
                )}

            </tbody>
        </table>
    );
};

export default UsersAndRolesTable;
