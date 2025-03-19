import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import Modal from "./Modal"; // Certifique-se de que está importando o modal correto

const ReportModal = ({ isOpen, closeModal }) => {
    const [reportData, setReportData] = useState([]);
    const [reportType, setReportType] = useState("finalizadas_por_assessor");

    useEffect(() => {
        console.log("ReportModal isOpen:", isOpen);
        console.log("Renderizando ReportModal. Estado isOpen:", isOpen);
    }, [isOpen]);

    async function fetchReport() {
        let query = supabase.from("tarefas").select("assessor, descricao, estado");

        if (reportType === "finalizadas_por_assessor") {
            query = query.eq("estado", "Finalizado");
        } else if (reportType === "iniciadas_por_assessor") {
            query = query.eq("estado", "Iniciado");
        } else if (reportType === "iniciadas") {
            query = query.eq("estado", "Iniciado");
        } else if (reportType === "finalizadas") {
            query = query.eq("estado", "Finalizado");
        }

        const { data, error } = await query;
        if (error) console.error("Erro ao buscar relatório:", error);
        else setReportData(data);
    }

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                <h2 className="text-xl font-bold mb-4">Relatório</h2>
                
                <select className="border p-2 mb-4 w-full" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="finalizadas_por_assessor">Assessores com tarefas finalizadas</option>
                    <option value="iniciadas_por_assessor">Assessores com tarefas iniciadas</option>
                    <option value="iniciadas">Tarefas iniciadas</option>
                    <option value="finalizadas">Tarefas finalizadas</option>
                </select>
    
                <button onClick={fetchReport} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Gerar Relatório</button>
                
                <table className="w-full border-collapse border border-gray-300">
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
                                <td className="border px-4 py-2">{item.assessor}</td>
                                <td className="border px-4 py-2">{item.descricao}</td>
                                <td className="border px-4 py-2">{item.estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
    
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">Fechar</button>
                </div>
            </div>
        </div>
    ) : null;
    
};

export default ReportModal;
