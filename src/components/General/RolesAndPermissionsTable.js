import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from '@/helpers';

const RolesAndPermissionsTable = ({
    roles,
    paginationData,
    changeSorting,
    deleteRole,
}) => {
    const [expandedModule, setExpandedModule] = useState(null);

    return (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-blue-900 text-white">
                <tr>
                    <th className="py-3 px-6 text-center w-1/24 cursor-pointer" onClick={() => changeSorting('id')}>
                        <span className='mr-2'>Id</span>
                        {paginationData.column === 'id' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 text-center w-1/6 cursor-pointer" onClick={() => changeSorting('name')}>
                        <span className='mr-2'>Rol</span>
                        {paginationData.column === 'name' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 w-1/2">Módulos/Permisos</th>
                    <th className="py-3 px-6 w-3/5 cursor-pointer" onClick={() => changeSorting('updated_at')}>
                        <span className='mr-2'>Última Actualización</span>
                        {paginationData.column === 'updated_at' && (paginationData.orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                    </th>
                    <th className="py-3 px-6 text-center w-1/4">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {roles.map((role) => {
                    const modules = role.permissions.reduce((acc, permission) => {
                        const [moduleName, permissionName] = permission.name.split('.');
                        if (!acc[moduleName]) acc[moduleName] = [];
                        acc[moduleName].push(permissionName);
                        return acc;
                    }, {});

                    return (
                        <tr key={role.id} className="border-b text-gray-700">
                            <td className="py-3 px-6 text-center"><strong>{role.id}</strong></td>
                            <td className="py-3 px-6 text-center"><strong>{role.name}</strong></td>
                            <td className="py-3 px-6 max-w-xs overflow-y-auto h-[100px]">
                                {Object.entries(modules).map(([moduleName, permissions]) => (
                                    <div key={moduleName} className="flex flex-wrap items-center mb-2">
                                        <strong
                                            className="cursor-pointer text-blue-500 hover:underline mr-4"
                                            onClick={() =>
                                                setExpandedModule(
                                                    expandedModule === moduleName ? null : moduleName
                                                )
                                            }
                                        >
                                            {moduleName}
                                        </strong>
                                        {expandedModule === moduleName &&
                                            permissions.map((permission) => (
                                                <span key={permission} className="mr-2 mb-2 bg-red-600 text-white px-4 py-1 rounded-full text-xs">
                                                    {permission}
                                                </span>
                                            ))}
                                    </div>
                                ))}
                            </td>
                            <td className="py-3 px-6 text-center"><strong>{formatDate(role.updated_at)}</strong></td>
                            <td className="py-3 px-6 text-center">
                                <Link
                                    href={`/roles/${role.id}`}
                                    className="text-blue-500 hover:underline mr-4"
                                    title='Editar permisos del rol'
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </Link>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => deleteRole(role.id)}
                                    title="Eliminar rol"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default RolesAndPermissionsTable;
