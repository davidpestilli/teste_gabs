import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TableRow from "./TableRow";

const Table = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setLoading(true);
        let { data, error } = await supabase.from("registros").select("*");
        if (error) console.error("Erro ao buscar dados:", error);
        else setDados(data);
        setLoading(false);
    }

    async function updateCell(id, column, value) {
        const { error } = await supabase
            .from("registros")
            .update({ [column]: value })
            .eq("id", id);

        if (error) console.error("Erro ao atualizar célula:", error);
        else carregarDados();
    }

    async function addRow() {
        const { error } = await supabase
            .from("registros")
            .insert([{ assessor: "", gabinete: "", processos: "", tarefas: "" }]);

        if (error) console.error("Erro ao adicionar linha:", error);
        else carregarDados();
    }

    async function deleteRows() {
        if (selectedRows.length === 0) return;

        const { error } = await supabase
            .from("registros")
            .delete()
            .in("id", selectedRows);

        if (error) console.error("Erro ao excluir linhas:", error);
        else {
            setSelectedRows([]);
            carregarDados();
        }
    }

    const handleRowSelection = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Testes pelos Gabinetes</h2>

            <div className="flex gap-4 mb-4">
                <button onClick={addRow} className="bg-green-500 text-white px-4 py-2 rounded">
                    Adicionar Linha
                </button>
                <button onClick={deleteRows} className="bg-red-500 text-white px-4 py-2 rounded" disabled={selectedRows.length === 0}>
                    Excluir Selecionados
                </button>
            </div>

            {loading ? (
                <p className="text-center">Carregando...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Selecionar</th>
                                <th className="border px-4 py-2">Assessor</th>
                                <th className="border px-4 py-2">Gabinete de Lotação</th>
                                <th className="border px-4 py-2">Processos</th>
                                <th className="border px-4 py-2">Tarefas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map((registro) => (
                                <TableRow
                                    key={registro.id}
                                    registro={registro}
                                    updateCell={updateCell}  // 🔹 Passando a função corretamente
                                    isSelected={selectedRows.includes(registro.id)}
                                    toggleSelection={() => handleRowSelection(registro.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Table;
