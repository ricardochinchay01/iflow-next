import { formatDate, convertMicrosecondsToTime } from 'helpers';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const NotificationsTable = ({
    column,
    orderBy,
    notificaciones,
    canViewNotificaciones,
    canDescargarNotificaciones,
    handleDownload,
    changeSorting,
}) => (
    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead className="bg-blue-900 text-white">
            <tr>
                <th className="w-1/7 text-left py-3 px-4 cursor-pointer" onClick={() => changeSorting('id')}>
                    <span className="mr-2">ID</span>
                    {column === 'id' && (orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                </th>
                <th className="w-2/5 text-left py-3 px-4">Mensaje</th>
                <th className="w-2/7 text-left py-3 px-4 cursor-pointer" onClick={() => changeSorting('response_time')}>
                    <span className="mr-2">Tiempo procesado</span>
                    {column === 'response_time' && (orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                </th>
                <th className="w-2/7 text-left py-3 px-4 cursor-pointer" onClick={() => changeSorting('updated_at')}>
                    <span className="mr-2">Última Actualización</span>
                    {column === 'updated_at' && (orderBy === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />)}
                </th>
                <th className="w-1/7 text-left py-3 px-4">Acciones</th>
            </tr>
        </thead>
        <tbody className="text-gray-700">
            {canViewNotificaciones
                ? notificaciones.map((notificacion, index) => (
                    <tr key={index} className="border-b">
                        <td className="text-left py-3 px-4">{notificacion.id}</td>
                        <td className="text-left py-3 px-4">{notificacion.message}</td>
                        <td className="text-left py-3 px-4">{convertMicrosecondsToTime(notificacion.response_time)}</td>
                        <td className="text-left py-3 px-4">{formatDate(notificacion.updated_at)}</td>
                        <td className="text-left py-3 px-4">
                            {canDescargarNotificaciones && (
                                <div
                                    role="button"
                                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                    onClick={() => handleDownload(notificacion.id)}
                                >
                                    Descargar
                                </div>
                            )}
                        </td>
                    </tr>
                ))
                : (
                    <tr>
                        <td colSpan={5} className="text-center py-3 px-4 text-red-600">No tienes permiso para ver las notificaciones</td>
                    </tr>
                )}
        </tbody>
    </table>
);

export default NotificationsTable;
