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

    // ✅ Adicionar nova tarefa
    async function addTask() {
        const numero = tarefas.length + 1;
        const { error } = await supabase.from("tarefas").insert([{ registro_id: registroId, numero, estado: "Não iniciado" }]);

        if (error) console.error("Erro ao adicionar tarefa:", error);
        else fetchTasks();
    }

    // ✅ Excluir tarefas selecionadas
    async function deleteSelectedTasks() {
        if (selectedTasks.length === 0) return;

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
            <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
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
                        setSelectedTaskId(taskId);
                        setSelectionModalOpen(true);
                    }}
                    openObservationModal={openObservationModal} // ✅ Passando corretamente a função
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
                        Fechar
                    </button>
                </div>

                <TaskObservationModal
                    isOpen={isObservationModalOpen}
                    closeModal={() => setObservationModalOpen(false)}
                    value={observationValue}
                    setValue={setObservationValue}
                    handleSave={() => {
                        setTarefas(prev =>
                            prev.map(tarefa =>
                                tarefa.id === selectedTaskForObservation ? { ...tarefa, observacoes: observationValue } : tarefa
                            )
                        );
                        setObservationModalOpen(false);
                    }}
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
                />
            </div>
        </div>
    ) : null;
};

export default TaskModal;