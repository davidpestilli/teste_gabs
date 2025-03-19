import TaskTable from "./TaskTable";

const TaskTableDisplay = ({ tarefas, loading, selectedTasks, setSelectedTasks, onTaskClick, openObservationModal }) => {
    return (
        <TaskTable
            tarefas={tarefas}
            loading={loading}
            updateTask={() => {}}
            openObservationModal={openObservationModal} // ✅ Agora está pegando a função corretamente
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            onTaskClick={onTaskClick}
        />
    );
};

export default TaskTableDisplay;


