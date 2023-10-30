import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import RolesAndPermissionsTable from './RolesAndPermissionsTable'
import PaginationTable from '../NewSan/PaginationTable'
import FilterRolesAndPermission from './FilterRolesAndPermission'

const RolesAndPermissionsContainer = ({
    roles,
    loading: loadingRoles,
    error: errorRoles,
    rolesWithPermissions,
    filterData,
    setFilterData,
    handleFilter,
    paginationData,
    setPaginationData,
    changeSorting,
    deleteRole,
    setShowModal,
}) => {
    const handleAddRole = () => {
        setShowModal(true)
    }

    if (loadingRoles) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        )
    }

    return (
        <>
            <FilterRolesAndPermission
                roles={roles}
                filterData={filterData}
                setFilterData={setFilterData}
                paginationData={paginationData}
                setPaginationData={setPaginationData}
                handleFilter={handleFilter}
                handleAddRole={handleAddRole}
            />
            <RolesAndPermissionsTable
                roles={rolesWithPermissions}
                paginationData={paginationData}
                changeSorting={changeSorting}
                deleteRole={deleteRole}
            />
            <PaginationTable
                paginationData={paginationData}
                setPaginationData={setPaginationData}
            />
        </>
    )
}

export default RolesAndPermissionsContainer
