import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TableRow from "./TableRow";
import TaskActions from "./TaskActions";
import ReportModal from "./ReportModal"; // 🔹 Agora importamos o modal separado
import TaskModal from "./TaskModal";

const Table = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setLoading(true);
        let { data, error } = await supabase.from("registros").select("*");
        if (error) console.error("Erro ao buscar dados:", error);
        else setDados(data);
        setLoading(false);
    }

    async function addRow() {
        const { error } = await supabase.from("registros").insert([{ assessor: "", gabinete: "", processos: "", tarefas: "" }]);
        if (error) console.error("Erro ao adicionar linha:", error);
        else carregarDados();
    }

    async function deleteRows() {
        if (selectedRows.length === 0) return;

        const { error } = await supabase.from("registros").delete().in("id", selectedRows);
        if (error) console.error("Erro ao excluir linhas:", error);
        else {
            setSelectedRows([]);
            carregarDados();
        }
    }

    async function updateCell(id, column, value) {
        console.log(`Atualizando ${column} do registro ID ${id} para: ${value}`);
    
        const { error } = await supabase
            .from("registros")
            .update({ [column]: value })
            .eq("id", id);
    
        if (error) {
            console.error("Erro ao atualizar registro:", error);
        } else {
            console.log("Registro atualizado com sucesso!");
            carregarDados(); // 🔄 Recarrega os dados para refletir as mudanças
        }
    }

    const handleRowSelection = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [currentTaskRegistroId, setCurrentTaskRegistroId] = useState(null);
    
    const openTaskModal = (registroId) => {
        setCurrentTaskRegistroId(registroId);
        setTaskModalOpen(true);
    };
    

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Testes pelos Gabinetes</h2>

            <TaskActions 
                addTask={addRow} 
                deleteSelectedTasks={deleteRows} 
                selectedTasks={selectedRows} 
                setReportModalOpen={setReportModalOpen} 
            />

            {loading ? (
                <p className="text-center">Carregando...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Selecionar</th>
                                <th className="border px-4 py-2">Assessor</th>
                                <th className="border px-4 py-2">Gabinete de Lotação</th>
                                <th className="border px-4 py-2">Processos</th>
                                <th className="border px-4 py-2">Tarefas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map((registro) => (
                                <TableRow
                                    key={registro.id}
                                    registro={registro}
                                    updateCell={updateCell}  // ✅ Passamos a função para cada linha
                                    isSelected={selectedRows.includes(registro.id)}
                                    toggleSelection={() => handleRowSelection(registro.id)}
                                    openTaskModal={() => openTaskModal(registro.id)} // ✅ Agora está passando corretamente a função
                                />
                            ))}
                        </tbody>
                    </table>

                        <TaskModal 
                            isOpen={isTaskModalOpen} 
                            closeModal={() => setTaskModalOpen(false)} 
                            registroId={currentTaskRegistroId} 
                        />

                </div>
            )}

            {/* 🔹 Modal separado para relatórios */}
            {isReportModalOpen && (
    <ReportModal 
        isOpen={true} 
        closeModal={() => {
            console.log("Fechando modal de relatório...");
            setReportModalOpen(false);
        }} 
    />
)}

        </div>
    );
};

export default Table;
