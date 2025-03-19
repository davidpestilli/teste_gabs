import { useState } from "react";
import Modal from "./Modal";
import TaskModal from "./TaskModal";

const TableRow = ({ registro, updateCell, isSelected, toggleSelection }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [column, setColumn] = useState("");
    const [value, setValue] = useState("");
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);

    const openModal = (colName, currentValue) => {
        setColumn(colName);
        setValue(currentValue || ""); 
        setModalOpen(true);
    };

    const handleSave = () => {
        updateCell(registro.id, column, value);
        setModalOpen(false);
    };

    return (
        <tr className={`hover:bg-gray-50 ${isSelected ? "bg-gray-200" : ""}`}>
            <td className="border px-4 py-2">
                <input type="checkbox" checked={isSelected} onChange={toggleSelection} />
            </td>
            <td className="border px-4 py-2 cursor-pointer" onClick={() => openModal("assessor", registro.assessor)}>
                {registro.assessor || "Clique para adicionar"}
            </td>
            <td className="border px-4 py-2 cursor-pointer" onClick={() => openModal("gabinete", registro.gabinete)}>
                {registro.gabinete || "Clique para adicionar"}
            </td>
            <td className="border px-4 py-2 cursor-pointer" onClick={() => openModal("processos", registro.processos)}>
                {registro.processos || "Clique para adicionar"}
            </td>
            <td className="border px-4 py-2 cursor-pointer text-blue-500 underline" onClick={() => setTaskModalOpen(true)}>
                {registro.tarefas ? "Ver tarefas" : "Adicionar tarefas"}
            </td>

            {/* Modal para Assessor, Gabinete e Processos */}
            <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)} column={column} value={value} setValue={setValue} handleSave={handleSave} />

            {/* Modal para Tarefas */}
            <TaskModal isOpen={isTaskModalOpen} closeModal={() => setTaskModalOpen(false)} registroId={registro.id} />
        </tr>
    );
};

export default TableRow;
