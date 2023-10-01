import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/router';

const useNewSan = () => {
    const router = useRouter();
    const [notificaciones, setNotificaciones] = useState([]);
    const [paginationData, setPaginationData] = useState({
        total: 0,
        perPage: 0,
        currentPage: 1,
        lastPage: 0,
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] = useState('desc');
    const [column, setColumn] = useState('id');

    const fetchPage = async (currentPage, startDate = '', endDate = '', orderId = '') => {
        setErrors([]);
        try {
            const perPage = 20;
            const response = await axios(`/api/v1/newsan/notification-logs?current_page=${currentPage}&per_page=${perPage}&order_by=${orderBy}&column=${column}&start_date=${startDate}&end_date=${endDate}&order_id=${orderId}`);
            const { data } = response;
            setNotificaciones(data.result.data);
            setPaginationData({
                total: data.result.total,
                perPage: data.result.perPage,
                currentPage: data.result.currentPage,
                lastPage: data.result.lastPage,
            });
        } catch (error) {
            if (error.response && error.response.status === 403) {
                router.push('/login');
                setErrors(error.response.data.errors);
            } else {
                console.error('Hubo un error al cargar las notificaciones:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const changeSorting = (newColumn) => {
        if (newColumn === column) {
            setOrderBy(orderBy === 'asc' ? 'desc' : 'asc');
        } else {
            setColumn(newColumn);
            setOrderBy('desc');
        }
    }

    const handleDownload = async (id) => {
        try {
            const response = await axios(`/api/v1/newsan/notification-logs/export/${id}`, {
                responseType: 'blob', // Especifica el tipo de respuesta como blob
            });

            if (response.status !== 200) {
                throw new Error("Error al descargar el archivo");
            }

            const contentDisposition = response.headers['content-disposition'];
            let filename = 'archivo.xlsx';

            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const blob = response.data; // Obtéengo el blob directamente de response.data
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error durante la descarga: ', error);
        }
    };

    useEffect(() => {
        fetchPage(paginationData.currentPage);
    }, [column, orderBy]);

    return {
        notificaciones,
        paginationData,
        errors,
        loading,
        fetchPage,
        handleDownload,
        changeSorting,
        orderBy,
        column,
    };
};

export default useNewSan;
