import { useEffect, useState } from "react";
import UsersAndRolesContainer from "@/components/General/UsersAndRolesContainer";
import RolesAndPermissionsContainer from "@/components/General/RolesAndPermissionsContainer";
import AppLayout from "@/components/Layouts/AppLayout";
import useRoles from "@/hooks/General/useRoles";
import useUsers from "@/hooks/General/useUsers";
import Head from "next/head";
import UserFormModal from "@/components/General/UserFormModal";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/router';
import AddRoleModal from "@/components/General/AddRoleModal";

const gestionar = () => {
    const router = useRouter();
    const { user, permissions, isLoading } = useAuth({ middleware: 'auth' });

    useEffect(() => {
        if (!isLoading && !permissions.includes('General.administrar_usuarios_y_permisos')) {
            router.push('/403');
        }
    }, [permissions, isLoading]);

    const [showModalUser, setShowModalUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [serverErrorsUser, setServerErrorsUser] = useState({});

    const [showModalRole, setShowModalRole] = useState(false);

    const {
        roles,
        loading: loadingRoles,
        error: errorRoles,
        rolesWithPermissions,
        paginationData: paginationDataRoles,
        setPaginationData: setPaginationDataRoles,
        filterData: filterDataRole,
        setFilterData: setFilterDataRole,
        handleFilter: handleFilterRole,
        deleteRole,
        addRoleWithPermissions,
        changeSorting: changeSortingRole,
    } = useRoles();

    const {
        users,
        paginationData,
        setPaginationData,
        loading: loadingUsers,
        errors: errorUsers,
        changeSorting: changeSortingUser,
        filterData,
        setFilterData,
        handleFilter,
        addUserWithRole,
        toggleUserStatus,
        updateUserWithRole,
    } = useUsers();

    const isAdmin = !isLoading && user ? user.roles?.some(role => role.name === 'administrador') : false;

    const closeModalUser = () => {
        setSelectedUser({});
        setShowModalUser(false);
    };

    const handleSubmitUser = async (formData) => {
        if (Object.keys(selectedUser).length === 0) {
            // Crear usuario
            try {
                const response = await addUserWithRole(formData);
                toast.success(response.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setServerErrorsUser({});
                closeModalUser();
            } catch (error) {
                console.error('Hubo un error al agregar el usuario:', error);
                const errors = error.response.data.errors;
                setServerErrorsUser(error.response.data.errors);

                // Muestro cada error en un toast diferente
                Object.keys(errors).forEach((field) => {
                    toast.error(errors[field][0], {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                });
                // Puedes añadir cualquier lógica adicional aquí, como mostrar un mensaje al usuario
            }
        } else {
            // Actualizar usuario
            try {
                const response = await updateUserWithRole(selectedUser.id, formData);
                toast.success(response.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setServerErrorsUser({});
                closeModalUser();
            } catch (error) {
                console.error('Hubo un error al editar el usuario:', error);
                const errors = error.response.data.errors;
                setServerErrorsUser(error.response.data.errors);

                // Muestro cada error en un toast diferente
                Object.keys(errors).forEach((field) => {
                    toast.error(errors[field][0], {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                });
            }
        }
    };

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Gesrionar usuarios, roles y permisos</h2>
            }
        >
            <Head>
                <title>Iflow - Gestionar Usuarios y Roles</title>
            </Head>

            <div className="py-6 px-8 bg-gray-100">
                <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8">
                    <UsersAndRolesContainer
                        roles={roles}
                        loadingRoles={loadingRoles}
                        errorRoles={errorRoles}
                        filterData={filterData}
                        setFilterData={setFilterData}
                        handleFilter={handleFilter}
                        paginationData={paginationData}
                        setPaginationData={setPaginationData}
                        setShowModal={setShowModalUser}
                        setSelectedUser={setSelectedUser}
                        users={users}
                        loading={loadingUsers}
                        error={errorUsers}
                        changeSorting={changeSortingUser}
                        toggleUserStatus={toggleUserStatus}
                    />

                    <UserFormModal
                        isOpen={showModalUser}
                        onClose={closeModalUser}
                        onSubmit={handleSubmitUser}
                        initialData={selectedUser}
                        data={{ roles }}
                        serverErrors={serverErrorsUser}
                    />

                    <RolesAndPermissionsContainer
                        roles={roles}
                        rolesWithPermissions={rolesWithPermissions}
                        loading={loadingRoles}
                        error={errorRoles}
                        filterData={filterDataRole}
                        setFilterData={setFilterDataRole}
                        handleFilter={handleFilterRole}
                        paginationData={paginationDataRoles}
                        setPaginationData={setPaginationDataRoles}
                        changeSorting={changeSortingRole}
                        setShowModal={setShowModalRole}
                        deleteRole={deleteRole}
                    />

                    <AddRoleModal
                        isOpen={showModalRole}
                        onClose={() => setShowModalRole(false)}
                        isAdmin={isAdmin}
                        addRoleWithPermissions={addRoleWithPermissions}
                    />

                    <ToastContainer />
                </div>
            </div>
        </AppLayout>
    );
};

export default gestionar;
