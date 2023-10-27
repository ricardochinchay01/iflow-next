const PaginationTable = ({ paginationData, setPaginationData }) => {
    const totalPages = Math.ceil(paginationData.total / paginationData.perPage);

    const getDisplayedPages = () => {
        const pages = [1];

        // Si solo hay una página, devolvemos solo esa página
        if (totalPages <= 1) {
            return pages;
        }

        if (paginationData.currentPage - 1 > 1) {
            pages.push(paginationData.currentPage - 1);
        }
        if (paginationData.currentPage !== 1 && paginationData.currentPage !== totalPages) {
            pages.push(paginationData.currentPage);
        }
        if (paginationData.currentPage + 1 < totalPages) {
            pages.push(paginationData.currentPage + 1);
        }
        pages.push(totalPages);

        return pages;
    };


    return (
        <div className="mt-2 flex flex-col space-y-2 p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <div className="text-gray-700">
                    {paginationData.total === 0
                        ? 'Mostrando 0 de un total de 0'
                        : `Mostrando ${((paginationData.currentPage - 1) * paginationData.perPage) + 1} al ${Math.min(paginationData.currentPage * paginationData.perPage, paginationData.total)} de un total de ${paginationData.total}`}
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        disabled={paginationData.currentPage === 1}
                        onClick={() => setPaginationData(prevState => ({ ...prevState, currentPage: prevState.currentPage - 1 }))}
                        className={`bg-blue-900 text-white px-4 py-2 rounded transition duration-300 ease-in-out ${paginationData.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                    >
                        Anterior
                    </button>

                    {getDisplayedPages().map(page => (
                        <button
                            key={page}
                            onClick={() => setPaginationData(prevState => ({ ...prevState, currentPage: page }))}
                            className={`px-4 py-2 mx-1 rounded transition duration-300 ease-in-out ${paginationData.currentPage === page ? 'bg-blue-900 text-white' : 'bg-white text-blue-900 border border-blue-900 hover:bg-blue-200'}`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={paginationData.currentPage === totalPages || totalPages === 0}
                        onClick={() => setPaginationData(prevState => ({ ...prevState, currentPage: prevState.currentPage + 1 }))}
                        className={`bg-blue-900 text-white px-4 py-2 rounded transition duration-300 ease-in-out ${paginationData.currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}`}
                    >
                        Siguiente
                    </button>

                </div>
            </div>
        </div>
    )
};


export default PaginationTable;
