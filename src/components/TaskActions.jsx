const TaskActions = ({ addTask, deleteSelectedTasks, selectedTasks }) => {
    return (
        <div className="flex gap-4 mb-4">
            <button onClick={addTask} className="bg-green-500 text-white px-4 py-2 rounded">
                Adicionar Linha
            </button>
            <button
                onClick={deleteSelectedTasks}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={selectedTasks.length === 0}
            >
                Excluir Selecionados
            </button>
        </div>
    );
};

export default TaskActions;
