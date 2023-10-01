import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import useNewSan from '@/hooks/useNewSan'
import { usePermissions } from '@/context/PermissionsContext'
import NotificationsTable from '@/components/NewSan/NotificationsTable'
import Filters from '@/components/NewSan/Filters'

const Index = () => {
    const {
        notificaciones,
        paginationData,
        errors,
        fetchPage,
        handleDownload,
        changeSorting,
        orderBy,
        column,
    } = useNewSan();

    const permissions = usePermissions()

    const canViewNotificaciones = permissions.includes('NewSan-ver_notificaciones')
    // const canCorrerNotificaciones = permissions.includes('NewSan-correr_notificaciones')
    const canDescargarNotificaciones = permissions.includes('NewSan-descargar_notificaciones')

    const applyFilters = (startDate, endDate, orderId) => {
        fetchPage(paginationData.currentPage, startDate, endDate, orderId);
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    New San
                </h2>
            }
        >
            <Head>
                <title>Iflow - New San</title>
            </Head>

            <div className="py-6">
                <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl mb-4">Notificaciones</h2>

                            <Filters
                                onFilter={applyFilters}
                            />

                            <div className="mb-4">
                                <span>Total de registros filtrados: {paginationData.total}</span>
                            </div>

                            <NotificationsTable
                                notificaciones={notificaciones}
                                canViewNotificaciones={canViewNotificaciones}
                                canDescargarNotificaciones={canDescargarNotificaciones}
                                handleDownload={handleDownload}
                                changeSorting={changeSorting}
                                orderBy={orderBy}
                                column={column}
                            />

                            <div className="mt-4 flex justify-center">
                                <button
                                    disabled={paginationData.currentPage === 1}
                                    onClick={() => fetchPage(paginationData.currentPage - 1)}
                                    className="mx-2"
                                >
                                    Anterior
                                </button>
                                <span className="mx-2">
                                    Página {paginationData.currentPage} de {paginationData.lastPage}
                                </span>
                                <button
                                    disabled={paginationData.currentPage === paginationData.lastPage}
                                    onClick={() => fetchPage(paginationData.currentPage + 1)}
                                    className="mx-2"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
