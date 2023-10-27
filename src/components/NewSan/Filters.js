import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSearch, faSortNumericUp } from "@fortawesome/free-solid-svg-icons";

const Filters = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    orderId,
    setOrderId,
    isButtonDisabled,
    handleFilter,
    paginationData,
    setPaginationData,
}) => (
    <div className="mb-2 bg-gray-100 p-4 rounded">
        <form onSubmit={handleFilter} className="flex justify-between items-center space-x-4">
            <div className="flex items-center space-x-2">
                <label>
                    Ver:
                    <select
                        value={paginationData.perPage}
                        onChange={(e) => setPaginationData(prevState => ({ ...prevState, perPage: e.target.value }))}
                        className="ml-2 border rounded p-1"
                        style={{ width: "80px" }}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCalendar} className="text-blue-900" />
                <label>
                    Fecha de inicio:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="ml-2 border rounded p-1" />
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faCalendar} className="text-blue-900" />
                <label>
                    Fecha de fin:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="ml-2 border rounded p-1" />
                </label>
            </div>
            <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faSortNumericUp} className="text-blue-900" />
                <label>
                    Order ID:
                    <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="ml-2 border rounded p-1" />
                </label>
            </div>
            <button type="submit" disabled={isButtonDisabled} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">
                <FontAwesomeIcon icon={faSearch} className="mr-2" /> Filtrar
            </button>
        </form>
    </div>
);

export default Filters;
