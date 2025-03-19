// AddAssessorModal.jsx
import { useState } from "react";
import { supabase } from "../services/supabaseClient";

const AddAssessorModal = ({ isOpen, closeModal, refreshData }) => {
  const [assessor, setAssessor] = useState("");
  const [gabinete, setGabinete] = useState("");
  const [processos, setProcessos] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!assessor || !gabinete || !processos) return; // Pode adicionar feedback de validação

    // Separa os processos por vírgula e remove espaços em branco
    const processosList = processos.split(",").map(p => p.trim()).filter(p => p !== "");

    // Cria um objeto para cada processo
    const rowsToInsert = processosList.map(processo => ({
      assessor,
      gabinete,
      processos: processo,
      tarefas: "" // ou outro valor padrão, se necessário
    }));

    const { error } = await supabase.from("registros").insert(rowsToInsert);
    if (error) {
      console.error("Erro ao adicionar assessor e processos:", error);
    } else {
      // Limpa os campos, fecha o modal e atualiza a tabela
      setAssessor("");
      setGabinete("");
      setProcessos("");
      closeModal();
      refreshData();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Adicionar Assessor e Processos</h2>
        <div className="mb-4">
          <label className="block mb-1">Assessor:</label>
          <input
            type="text"
            className="w-full border p-2"
            value={assessor}
            onChange={(e) => setAssessor(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Gabinete:</label>
          <input
            type="text"
            className="w-full border p-2"
            value={gabinete}
            onChange={(e) => setGabinete(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Processos (separados por vírgula):</label>
          <input
            type="text"
            className="w-full border p-2"
            value={processos}
            onChange={(e) => setProcessos(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssessorModal;
