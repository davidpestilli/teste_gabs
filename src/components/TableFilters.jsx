const TableFilters = ({ filtroAssessor, setFiltroAssessor, filtroGabinete, setFiltroGabinete }) => {
    return (
        <div className="mb-4 flex gap-4">
            <input
                type="text"
                placeholder="Filtrar por Assessor"
                className="border p-2 w-full"
                value={filtroAssessor}
                onChange={(e) => setFiltroAssessor(e.target.value)}
            />
            <input
                type="text"
                placeholder="Filtrar por Gabinete"
                className="border p-2 w-full"
                value={filtroGabinete}
                onChange={(e) => setFiltroGabinete(e.target.value)}
            />
        </div>
    );
};

export default TableFilters;
