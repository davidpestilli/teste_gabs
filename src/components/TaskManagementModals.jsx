import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const TaskSelectionModal = ({ isOpen, closeModal, onSave }) => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (isOpen) fetchTasks();
    }, [isOpen]);

    async function fetchTasks() {
        const { data, error } = await supabase
            .from("tasks")
            .select("id, group_id, task, task_groups(group_name)"); // 🚀 Busca o nome do grupo
    
        if (error) {
            console.error("Erro ao buscar tarefas:", error);
        } else {
            setTasks(data);
        }
    }
    

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1300px] h-[60vh]">   
                <h2 className="text-xl font-bold mb-4">Selecionar Tarefa</h2>
                <div className="overflow-y-auto max-h-[480px]">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Selecionar</th>
                                <th className="border px-4 py-2">Grupo</th>
                                <th className="border px-4 py-2">Tarefa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">
                                        <input
                                            type="radio"
                                            name="selectedTask"
                                            onChange={() => setSelectedTask(task.id)}
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{task.task_groups?.group_name || "Sem grupo"}</td>
                                    <td className="border px-4 py-2">{task.task}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            const selectedTaskObj = tasks.find(task => task.id === selectedTask);
                            if (selectedTaskObj) {
                                onSave(selectedTaskObj.id, selectedTaskObj.task); // Agora passa ID e Descrição
                            }
                        }}
                        className={`px-4 py-2 rounded ${selectedTask ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
                        disabled={!selectedTask}
                    >
                        Salvar
                    </button>

                </div>
            </div>
        </div>
    ) : null;
};

const TaskGroupModal = ({ isOpen, closeModal, onSave }) => {
    const [group, setGroup] = useState("");
    const [tasks, setTasks] = useState("");

    async function handleSave() {
        const taskList = tasks.split(",").map(task => task.trim()).filter(task => task);
        if (!group || taskList.length === 0) return;

        const { data, error } = await supabase.from("task_groups").insert([{ group_name: group }]).select();
        if (error) {
            console.error("Erro ao salvar grupo:", error);
            return;
        }
        
        const groupId = data[0].id;
        const taskInserts = taskList.map(task => ({ group_id: groupId, task }));
        
        const { error: taskError } = await supabase.from("tasks").insert(taskInserts);
        if (taskError) console.error("Erro ao salvar tarefas:", taskError);
        else onSave();
    }

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1000px]">
                <h2 className="text-xl font-bold mb-4">Gerenciar Grupo de Tarefas</h2>
                <input
                    type="text"
                    className="w-full border p-2 mb-2"
                    placeholder="Nome do Grupo"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                />
                <textarea
                    className="w-full border p-2 h-24"
                    placeholder="Tarefas (separadas por vírgula)"
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 rounded ${group && tasks ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
                        disabled={!group || !tasks}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export { TaskSelectionModal, TaskGroupModal };
