import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import FiltersUserAndRoles from './FiltersUserAndRoles'
import UsersAndRolesTable from './UsersAndRolesTable'
import PaginationTable from '../NewSan/PaginationTable'

const UsersAndRolesContainer = ({
    roles,
    loadingRoles,
    errorRoles,
    filterData,
    setFilterData,
    handleFilter,
    paginationData,
    setPaginationData,
    users,
    loadingUsers,
    errorUsers,
    changeSorting,
    toggleUserStatus,
    setShowModal,
    setSelectedUser,
}) => {
    const handleAddUser = () => {
        setSelectedUser({})
        setShowModal(true)
    }

    const handleEditUser = user => {
        setSelectedUser(user)
        setShowModal(true)
    }

    if (loadingRoles)
        return (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        )
    if (errorRoles) return <p>Error al cargar los roles: {errorRoles}</p>

    return (
        <>
            <FiltersUserAndRoles
                roles={roles}
                filterData={filterData}
                setFilterData={setFilterData}
                paginationData={paginationData}
                setPaginationData={setPaginationData}
                handleFilter={handleFilter}
                handleAddUser={handleAddUser}
            />
            <UsersAndRolesTable
                users={users}
                loading={loadingUsers}
                error={errorUsers}
                paginationData={paginationData}
                changeSorting={changeSorting}
                handleEditUser={handleEditUser}
                toggleUserStatus={toggleUserStatus}
            />
            <PaginationTable
                paginationData={paginationData}
                setPaginationData={setPaginationData}
            />
        </>
    )
}

export default UsersAndRolesContainer
