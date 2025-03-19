import TaskTable from "./TaskTable";

const TaskTableDisplay = ({ tarefas, loading, selectedTasks, setSelectedTasks, onTaskClick }) => {
    return (
        <TaskTable
            tarefas={tarefas}
            loading={loading}
            updateTask={() => {}}
            openObservationModal={() => {}}
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            onTaskClick={onTaskClick}  // ✅ Passando corretamente para TaskTable.jsx
        />
    );
};

export default TaskTableDisplay;

