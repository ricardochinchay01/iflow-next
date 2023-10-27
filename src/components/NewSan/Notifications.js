import React from 'react';
import Filters from './Filters';
import NotificationsTable from './NotificationsTable';
import PaginationTable from './PaginationTable';
import useNewSan from '@/hooks/NewSan/useNewSan';

const Notifications = ({ canViewNotificaciones, canDescargarNotificaciones }) => {
    const {
        notificaciones,
        paginationData,
        errors,
        handleDownload,
        changeSorting,
        orderBy,
        column,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        orderId,
        setOrderId,
        isButtonDisabled,
        handleFilter,
        setPaginationData,
        perPage,
        setPerPage,
    } = useNewSan();

    return (
        <div className="py-6 px-8 bg-gray-100">
            <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8">
                <Filters
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    orderId={orderId}
                    setOrderId={setOrderId}
                    isButtonDisabled={isButtonDisabled}
                    handleFilter={handleFilter}
                    paginationData={paginationData}
                    setPaginationData={setPaginationData}
                />

                <NotificationsTable
                    column={column}
                    orderBy={orderBy}
                    notificaciones={notificaciones}
                    canViewNotificaciones={canViewNotificaciones}
                    canDescargarNotificaciones={canDescargarNotificaciones}
                    handleDownload={handleDownload}
                    changeSorting={changeSorting}
                />

                <PaginationTable
                    paginationData={paginationData}
                    setPaginationData={setPaginationData}
                />
            </div>
        </div>
    );
};

export default Notifications;
