import TaskTable from "./TaskTable";

const TaskTableDisplay = ({ tarefas, loading, selectedTasks, setSelectedTasks, onTaskClick, updateTask, openObservationModal }) => {
    return (
        <TaskTable
            tarefas={tarefas}
            loading={loading}
            updateTask={updateTask} // ✅ Agora está correto!
            openObservationModal={openObservationModal} 
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            onTaskClick={onTaskClick}
        />
    );
};

export default TaskTableDisplay;


