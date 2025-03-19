import { useState, useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";

const ReportModal = ({ isOpen, closeModal }) => {
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState("iniciadas_por_assessor");
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    console.log("ReportModal isOpen:", isOpen);
  }, [isOpen]);

  async function fetchReport() {
    // Realiza a junção com a tabela "registros" para obter o campo "assessor"
    let query = supabase
      .from("tarefas")
      .select("descricao, estado, registros(assessor)");

    if (reportType === "finalizadas_por_assessor") {
      query = query.eq("estado", "Finalizado");
    } else if (reportType === "iniciadas_por_assessor") {
      query = query.eq("estado", "Iniciado");
    } else if (reportType === "nao_iniciadas") {
      query = query.eq("estado", "Não iniciado");
    }

    const { data, error } = await query;
    if (error) {
      console.error("Erro ao buscar relatório:", error);
    } else {
      setReportData(data);
    }
  }

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-hidden relative">
        {/* Botão X para fechar o modal */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">Relatório</h2>

        <select
          className="border p-2 mb-4 w-full"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="iniciadas_por_assessor">Tarefas Iniciadas</option>
          <option value="finalizadas_por_assessor">Tarefas Finalizadas</option>
          <option value="nao_iniciadas">Tarefas Não Iniciadas</option>
        </select>

        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Gerar Relatório
        </button>

        {/* Container com altura limitada e rolagem */}
        <div
          ref={scrollContainerRef}
          className="max-h-[400px] overflow-y-auto border border-gray-300"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Assessor</th>
                <th className="border px-4 py-2">Tarefa</th>
                <th className="border px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {item.registros && item.registros.assessor
                      ? item.registros.assessor
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">{item.descricao}</td>
                  <td className="border px-4 py-2">{item.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
};

export default ReportModal;
