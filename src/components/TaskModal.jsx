import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TaskTableDisplay from "./TaskTableDisplay";
import TaskManagementActions from "./TaskManagementActions"; // ✅ Importando corretamente
import TaskModalsContainer from "./TaskModalsContainer";
import TaskObservationModal from "./TaskObservationModal"; // ✅ Importando o modal de observação


const TaskModal = ({ isOpen, closeModal, registroId }) => {
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const updateTask = async (taskId, field, value) => {
        console.log(`Tentando atualizar tarefa ID ${taskId} -> ${field}: ${value}`);
    
        // 🔄 Mapear os nomes dos campos corretamente
        const fieldMap = {
            "Tarefa": "descricao",
            "Observações": "observacoes",
            "Estado": "estado"
        };
    
        const supabaseField = fieldMap[field] || field; // Se não estiver no mapa, usa o nome original
    
        const { error } = await supabase
            .from("tarefas")
            .update({ [supabaseField]: value })
            .eq("id", taskId)
            .select();
    
        if (error) {
            console.error("Erro ao atualizar tarefa:", error);
        } else {
            console.log(`Campo ${supabaseField} atualizado com sucesso para ${value}`);
            fetchTasks(); // 🔄 Atualiza a lista de tarefas para refletir a mudança
        }
    };
    
    
    
    
    useEffect(() => {
        if (isOpen) fetchTasks();
    }, [isOpen]);

    async function fetchTasks() {
        setLoading(true);
        const { data, error } = await supabase.from("tarefas").select("*").eq("registro_id", registroId).order("numero", { ascending: true });
        if (error) console.error("Erro ao buscar tarefas:", error);
        else setTarefas(data);
        setLoading(false);
    }

    const handleSaveObservation = async () => {
        const { error } = await supabase
            .from("tarefas")
            .update({ observacoes: observationValue })
            .eq("id", selectedTaskForObservation);
    
        if (error) {
            console.error("Erro ao salvar observação:", error);
        } else {
            fetchTasks(); // 🔹 Atualiza a tabela após salvar no banco
            setObservationModalOpen(false);
        }
    };
  
    
    

    async function addTask() {
        const numero = tarefas.length + 1; // Define o número sequencial da tarefa
    
        const { data, error } = await supabase.from("tarefas").insert([
            {
                registro_id: registroId, // 🔄 Garante que a tarefa pertence ao registro correto
                numero: numero, 
                descricao: "", // 🔄 Inicia com uma descrição vazia
                estado: "Não iniciado",
                observacoes: ""
            }
        ]).select("*"); // Retorna os dados inseridos para confirmação
    
        if (error) {
            console.error("Erro ao adicionar tarefa:", error);
        } else {
            console.log("Tarefa adicionada com sucesso:", data);
            fetchTasks(); // Atualiza a lista
        }
    }
    
    async function deleteSelectedTasks() {
        if (selectedTasks.length === 0) return;
        if (!window.confirm("Tem certeza que deseja excluir os processos selecionados?")) return;
    
        const { error } = await supabase.from("tarefas").delete().in("id", selectedTasks);
        if (error) console.error("Erro ao excluir tarefas:", error);
        else {
            setSelectedTasks([]);
            fetchTasks();
        }
    }
    
    
    const [isObservationModalOpen, setObservationModalOpen] = useState(false);
    const [observationValue, setObservationValue] = useState("");
    const [selectedTaskForObservation, setSelectedTaskForObservation] = useState(null);

    const openObservationModal = (taskId, currentObservations) => {
        setSelectedTaskForObservation(taskId);
        setObservationValue(currentObservations || "");
        setObservationModalOpen(true);
    };


    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1500px]">
                <h2 className="text-xl font-bold mb-4">Gerenciar Tarefas</h2>

                {/* ✅ Agrupando os botões na mesma linha */}
                <div className="flex gap-4 mb-4">
                    <TaskManagementActions
                        addTask={addTask} 
                        deleteSelectedTasks={deleteSelectedTasks} 
                        selectedTasks={selectedTasks}
                    />
                    <button 
                        onClick={() => setGroupModalOpen(true)} 
                        className="bg-gray-500 text-white px-4 py-1 h-[32px] rounded flex items-center"
                    >
                        Gerenciar Grupos
                    </button>
                </div>

                <TaskTableDisplay 
                    tarefas={tarefas} 
                    loading={loading} 
                    selectedTasks={selectedTasks} 
                    setSelectedTasks={setSelectedTasks} 
                    onTaskClick={(taskId) => {
                        console.log(`Abrindo seleção de tarefa para ID: ${taskId}`);
                        setSelectedTaskId(taskId);
                        setSelectionModalOpen(true);
                    }}
                    updateTask={updateTask}
                    openObservationModal={(taskId, observacoes) => {
                        setSelectedTaskForObservation(taskId); // ✅ Define a tarefa correta
                        setObservationValue(observacoes || ""); // ✅ Preenche o campo com o valor atual ou vazio
                        setObservationModalOpen(true); // ✅ Abre o modal
                    }}
                />

                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Fechar
                    </button>


                    <TaskObservationModal
                        isOpen={isObservationModalOpen}
                        closeModal={() => setObservationModalOpen(false)}
                        value={observationValue}
                        setValue={setObservationValue}
                        handleSave={handleSaveObservation} // ✅ Agora usa a função corretamente
                    />

                
                <TaskModalsContainer 
                    isSelectionModalOpen={isSelectionModalOpen} 
                    setSelectionModalOpen={setSelectionModalOpen} 
                    isGroupModalOpen={isGroupModalOpen} 
                    setGroupModalOpen={setGroupModalOpen} 
                    fetchTasks={fetchTasks} 
                    registroId={registroId} 
                    setTarefas={setTarefas} 
                    selectedTaskId={selectedTaskId}
                    updateTask={updateTask}
                />
            </div>
        </div>
    ) : null;
};

export default TaskModal;