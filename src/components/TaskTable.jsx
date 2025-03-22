const TaskTable = ({ tarefas, loading, updateTask, openObservationModal, selectedTasks, setSelectedTasks, onTaskClick }) => {

    const handleSelectAllTasks = () => {
        if (selectedTasks.length === tarefas.length) {
          setSelectedTasks([]);
        } else {
          const allIds = tarefas.map(tarefa => tarefa.id);
          setSelectedTasks(allIds);
        }
      };

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-4 flex justify-start items-center">
                            <input 
                                type="checkbox"
                                onChange={handleSelectAllTasks}
                                checked={selectedTasks.length === tarefas.length && tarefas.length > 0}
                            />
                        </th>
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Tarefa</th>
                        <th className="border px-4 py-2">Status do Serviço</th>
                        <th className="border px-4 py-2">Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center p-4">Carregando...</td>
                        </tr>
                    ) : tarefas.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center p-4">Nenhuma tarefa</td>
                        </tr>
                    ) : (
                        tarefas.map((tarefa) => (
                            <tr key={tarefa.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.includes(tarefa.id)}
                                        onChange={() => {
                                            setSelectedTasks((prev) =>
                                                prev.includes(tarefa.id) ? prev.filter((id) => id !== tarefa.id) : [...prev, tarefa.id]
                                            );
                                        }}
                                    />
                                </td>
                                <td className="border px-4 py-2">{tarefa.numero}</td>
                                <td 
                                    className="border px-4 py-2 cursor-pointer text-blue-500 underline"
                                    onClick={() => onTaskClick(tarefa.id)}  // ✅ Agora chama a função corretamente
                                >
                                    {tarefa.descricao || "Clique para adicionar"}
                                </td>
                                <td className="border px-4 py-2">
                                    <select
                                        className="border p-1 w-full"
                                        value={tarefa.estado}
                                        onChange={(e) => updateTask(tarefa.id, "estado", e.target.value)}
                                    >
                                        <option value="Não iniciado">Não iniciado</option>
                                        <option value="Iniciado">Iniciado</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </select>
                                </td>
                                <td
                                    className="border px-4 py-2 cursor-pointer text-blue-500 underline"
                                    onClick={() => openObservationModal(tarefa.id, tarefa.observacoes)}
                                >
                                    {tarefa.observacoes ? tarefa.observacoes.slice(0, 30) + "..." : "Adicionar observação"}
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
