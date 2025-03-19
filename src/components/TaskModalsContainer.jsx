import { TaskSelectionModal, TaskGroupModal } from "./TaskManagementModals";

const TaskModalsContainer = ({ 
    isSelectionModalOpen, 
    setSelectionModalOpen, 
    isGroupModalOpen, 
    setGroupModalOpen, 
    fetchTasks, 
    registroId, 
    setTarefas, 
    selectedTaskId 
}) => {
    return (
        <>
                <TaskSelectionModal
                    isOpen={isSelectionModalOpen}
                    closeModal={() => setSelectionModalOpen(false)}
                    onSave={(taskId, taskDescription) => {
                        if (taskId) {
                            setTarefas((prevTarefas) =>
                                prevTarefas.map((tarefa) =>
                                    tarefa.id === selectedTaskId ? { ...tarefa, descricao: taskDescription } : tarefa
                                )
                            );
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
