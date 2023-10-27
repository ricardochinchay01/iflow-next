import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSearch, faUserAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { paginationOptions } from "./PaginationOptions";
import CustomInput from "../Common/CustomInput";
import CustomSelect from "../Common/CustomSelect";

const FiltersUserAndRoles = ({
    roles,
    filterData,
    setFilterData,
    handleFilter,
    paginationData,
    setPaginationData,
    handleAddUser,
}) => {
    return (
        <div className="mb-2 bg-gray-100 p-4 rounded mt-10">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Listado de Usuarios y Roles</h1>
                <button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleAddUser}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Usuario
                </button>
            </div>
            <form onSubmit={handleFilter} className="flex justify-between items-center space-x-4">
                <CustomSelect
                    value={paginationData.perPage}
                    onChange={(e) => setPaginationData(prevState => ({ ...prevState, perPage: e.target.value }))}
                    label="Ver"
                    icon={null}
                    options={paginationOptions}
                    width="80"
                />
                <CustomSelect
                    value={filterData.roleId}
                    onChange={(e) => setFilterData(prevState => ({ ...prevState, roleId: e.target.value }))}
                    label="Rol"
                    icon={faUserCircle}
                    options={roles}
                />
                <CustomInput
                    value={filterData.username}
                    onChange={(e) => setFilterData(prevState => ({ ...prevState, username: e.target.value }))}
                    label="Nombre de usuario"
                    icon={faUserAlt}
                />
                <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">
                    <FontAwesomeIcon icon={faSearch} className="mr-2" /> Filtrar
                </button>
            </form>
        </div>
    );
};

export default FiltersUserAndRoles;
