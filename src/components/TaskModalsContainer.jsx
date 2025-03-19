import { TaskSelectionModal, TaskGroupModal } from "./TaskManagementModals";
import { supabase } from "../services/supabaseClient";


const TaskModalsContainer = ({ 
    isSelectionModalOpen, 
    setSelectionModalOpen, 
    isGroupModalOpen, 
    setGroupModalOpen, 
    fetchTasks, 
    registroId, 
    setTarefas, 
    selectedTaskId,
    updateTask
}) => {
    return (
        <>
                <TaskSelectionModal
                    isOpen={isSelectionModalOpen}
                    closeModal={() => setSelectionModalOpen(false)}
                    onSave={(taskId, taskDescription) => {
                        if (taskId) {
                            // Atualiza o estado local
                            setTarefas((prevTarefas) =>
                                prevTarefas.map((tarefa) =>
                                    tarefa.id === selectedTaskId ? { ...tarefa, descricao: taskDescription } : tarefa
                                )
                            );
                    
                            // Persiste a alteração no banco de dados
                            supabase
                              .from("tarefas")
                              .update({ descricao: taskDescription })
                              .eq("id", selectedTaskId)
                              .then(({ error }) => {
                                  if (error) {
                                      console.error("Erro ao atualizar tarefa:", error);
                                  }
                              });
                        }
                        setSelectionModalOpen(false);
                    }}
                    
                />


            <TaskGroupModal
                isOpen={isGroupModalOpen}
                closeModal={() => setGroupModalOpen(false)}
                onSave={() => {
                    fetchTasks();
                    setGroupModalOpen(false);
                }}
            />
        </>
    );
};


export default TaskModalsContainer;
