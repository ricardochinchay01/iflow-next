import { useEffect, useState } from "react";
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState('');

    const [paginationData, setPaginationData] = useState({
        total: 0,
        perPage: 10,
        currentPage: 1,
        lastPage: 0,
        orderBy: 'desc',
        column: 'id'
    });

    const [filterData, setFilterData] = useState({
        roleId: '',
        username: '',
    });

    const fetchPage = async (currentPage, perPage = 10, column = 'id', orderBy = 'desc') => {
        try {
            setLoading(true);

            const response = await axios.get(`/api/users?current_page=${currentPage}&per_page=${perPage}&order_by=${orderBy}&column=${column}&name=${filterData.username}&roleId=${filterData.roleId}`)
            const { data } = response;
            setUsers(data.result.data)
            setPaginationData(prevData => ({
                ...prevData,
                total: data.result.total,
                perPage: data.result.perPage,
                currentPage: data.result.currentPage,
                lastPage: data.result.lastPage,
            }));
        } catch (error) {
            setErrors('Error al cargar los usuarios')
        } finally {
            setLoading(false);
        }
    }

    const changeSorting = (newColumn) => {
        setPaginationData(prevData => ({
            ...prevData,
            column: newColumn === prevData.column ? prevData.column : newColumn,
            orderBy: newColumn === prevData.column ? (prevData.orderBy === 'asc' ? 'desc' : 'asc') : 'desc',
        }));
    }

    const handleFilter = (e) => {
        e.preventDefault();
        fetchPage(1, paginationData.perPage, paginationData.column, paginationData.orderBy);
    }

    const addUserWithRole = async (newUser) => {
        try {
            setLoading(true);
            const response = await axios.post(`/api/users`, newUser);
            const addedUser = { ...response.data.user, deleted_at: null };
            setUsers(prevUsers => [addedUser, ...prevUsers]);
            return response.data;
        } catch (error) {
            console.log(error)
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUserWithRole = async (userId, updatedUser) => {
        try {
            setLoading(true);
            const response = await axios.put(`/api/users/${userId}`, updatedUser);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? response.data.user : user
                )
            );
            return response.data;
        } catch (error) {
            console.log(error)
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId) => {
        const isConfirmed = window.confirm('¿Estás seguro de que deseas cambiar el estado del usuario?');

        if (!isConfirmed) return;

        try {
            setLoading(true);
            const response = await axios.post(`/api/users/${userId}/toggle-status`);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? response.data.user : user
                )
            );
            toast.success(response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            return response.data;
        } catch (error) {
            console.log(error.response.data.error)
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            // throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage(paginationData.currentPage, paginationData.perPage, paginationData.column, paginationData.orderBy);
    }, [paginationData.column, paginationData.orderBy, paginationData.currentPage, paginationData.perPage]);

    return {
        users,
        loading,
        errors,
        filterData,
        setFilterData,
        handleFilter,
        changeSorting,
        paginationData,
        setPaginationData,
        addUserWithRole,
        toggleUserStatus,
        updateUserWithRole,
    }
};

export default useUsers;
