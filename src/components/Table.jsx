import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TableFilters from "./TableFilters";
import TableRow from "./TableRow";

const Table = () => {
    const [dados, setDados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroAssessor, setFiltroAssessor] = useState("");
    const [filtroGabinete, setFiltroGabinete] = useState("");

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

        if (error) console.error("Erro ao atualizar:", error);
        else carregarDados();
    }

    const dadosFiltrados = dados.filter(registro =>
        registro.assessor?.toLowerCase().includes(filtroAssessor.toLowerCase()) &&
        registro.gabinete?.toLowerCase().includes(filtroGabinete.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Registros de Usuários</h2>

            <TableFilters
                filtroAssessor={filtroAssessor}
                setFiltroAssessor={setFiltroAssessor}
                filtroGabinete={filtroGabinete}
                setFiltroGabinete={setFiltroGabinete}
            />

            {loading ? (
                <p className="text-center">Carregando...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Assessor</th>
                                <th className="border border-gray-300 px-4 py-2">Gabinete de Lotação</th>
                                <th className="border border-gray-300 px-4 py-2">Processos</th>
                                <th className="border border-gray-300 px-4 py-2">Tarefas</th>
                                <th className="border border-gray-300 px-4 py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosFiltrados.map((registro) => (
                                <TableRow key={registro.id} registro={registro} updateCell={updateCell} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Table;
