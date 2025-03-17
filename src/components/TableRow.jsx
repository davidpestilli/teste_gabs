import { useState } from "react";
import Modal from "./Modal";

const TableRow = ({ registro, updateCell }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [column, setColumn] = useState("");
    const [value, setValue] = useState("");

    const openModal = (colName, currentValue) => {
        setColumn(colName);
        setValue(currentValue || ""); // Se não houver valor, mantém vazio
        setModalOpen(true);
    };

    const handleSave = () => {
        updateCell(registro.id, column, value);
        setModalOpen(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => openModal("assessor", registro.assessor)}>
                {registro.assessor || "Clique para adicionar"}
            </td>
            <td className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => openModal("gabinete", registro.gabinete)}>
                {registro.gabinete || "Clique para adicionar"}
            </td>
            <td className="border border-gray-300 px-4 py-2 cursor-pointer" onClick={() => openModal("processos", registro.processos)}>
                {registro.processos || "Clique para adicionar"}
            </td>
            <td className="border border-gray-300 px-4 py-2">{registro.tarefas}</td>
            <td className="border border-gray-300 px-4 py-2">
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Editar
                </button>
            </td>

            <Modal
                isOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
                column={column}
                value={value}
                setValue={setValue}
                handleSave={handleSave}
            />
        </tr>
    );
};

export default TableRow;
