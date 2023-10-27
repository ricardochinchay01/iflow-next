import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderTree, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { paginationOptions } from "./PaginationOptions";
import CustomSelect from "../Common/CustomSelect";
import { extractModules } from "@/helpers/extractModules";

const FilterRolesAndPermission = ({
    roles,
    filterData,
    setFilterData,
    paginationData,
    setPaginationData,
    handleFilter,
    handleAddRole,
}) => {
    extractModules(roles);

    return (
        <div className="mb-2 bg-gray-100 p-4 rounded mt-10">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Listado de Roles y Permisos</h1>
                <button
                    type="button"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleAddRole}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Rol
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
                    value={filterData.moduleId}
                    onChange={(e) => setFilterData(prevState => ({ ...prevState, moduleId: e.target.value }))}
                    label="Modulo"
                    icon={faFolderTree}
                    options={extractModules(roles)}
                />
                <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">
                    <FontAwesomeIcon icon={faSearch} className="mr-2" /> Filtrar
                </button>
            </form>
        </div>
    );
};

export default FilterRolesAndPermission;
