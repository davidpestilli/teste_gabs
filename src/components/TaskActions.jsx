const TaskActions = ({ addTask, deleteSelectedTasks, selectedTasks, openReportModal }) => {
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
            <button
                onClick={openReportModal} // 🔹 Certifique-se de que essa função está sendo passada
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Relatório
            </button>
        </div>
    );
};

export default TaskActions;
