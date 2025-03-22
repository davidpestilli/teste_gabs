import { useState, useRef } from "react";
import { supabase } from "../services/supabaseClient";

const ReportModal = ({ isOpen, closeModal }) => {
  const [reportData, setReportData] = useState([]);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [reportType, setReportType] = useState("iniciadas_por_assessor");
  const scrollContainerRef = useRef(null);

  async function fetchReport() {
    console.log("Botão Gerar Relatório clicado.");
    console.log("Tipo de relatório selecionado:", reportType);

    // Busca a lista completa de tarefas na tabela "tasks"
    // Nota: a coluna com a descrição da tarefa é "task" nesta tabela
    const { data: allTasks, error: errAllTasks } = await supabase
      .from("tasks")
      .select("*");
    if (errAllTasks) {
      console.error("Erro ao buscar todas as tarefas (tasks):", errAllTasks);
      return;
    }
    setTotalTasksCount(allTasks.length);
    console.log("Todas as tarefas (tabela tasks):", allTasks, "Total:", allTasks.length);

    if (reportType === "nao_selecionadas") {
      console.log("Iniciando lógica para Tarefas Não Selecionadas...");

      // Busca tarefas atribuídas na tabela "tarefas" com os estados respectivos.
      // Nesta tabela, a descrição da tarefa está em "descricao"
      const { data: iniciadas, error: errIniciadas } = await supabase
        .from("tarefas")
        .select("*")
        .eq("estado", "Iniciado");
      console.log("Tarefas iniciadas:", iniciadas, "Erro:", errIniciadas);

      const { data: finalizadas, error: errFinalizadas } = await supabase
        .from("tarefas")
        .select("*")
        .eq("estado", "Finalizado");
      console.log("Tarefas finalizadas:", finalizadas, "Erro:", errFinalizadas);

      const { data: naoIniciadas, error: errNaoIniciadas } = await supabase
        .from("tarefas")
        .select("*")
        .eq("estado", "Não iniciado");
      console.log("Tarefas não iniciadas:", naoIniciadas, "Erro:", errNaoIniciadas);

      if (errIniciadas || errFinalizadas || errNaoIniciadas) {
        console.error(
          "Erro ao buscar tarefas dos relatórios:",
          errIniciadas,
          errFinalizadas,
          errNaoIniciadas
        );
        return;
      }

      // Cria um conjunto com as descrições das tarefas já atribuídas
      const selectedTaskDescriptions = new Set();
      [iniciadas, finalizadas, naoIniciadas].forEach(list => {
        list.forEach(task => {
          if (task.descricao) {
            selectedTaskDescriptions.add(task.descricao);
          }
        });
      });
      console.log("Conjunto de tarefas atribuídas (descrições):", selectedTaskDescriptions);

      // Calcula a diferença: tarefas que estão na lista completa (allTasks) e 
      // cujas descrições não constam no conjunto dos atribuídos.
      const nonSelectedTasks = allTasks.filter(task => !selectedTaskDescriptions.has(task.task));
      console.log("Tarefas não selecionadas (diferença):", nonSelectedTasks);

      setReportData(nonSelectedTasks);
    } else {
      // Para os demais relatórios (iniciadas, finalizadas, não iniciadas), consulta a tabela "tarefas"
      let stateFilter;
      if (reportType === "iniciadas_por_assessor") stateFilter = "Iniciado";
      if (reportType === "finalizadas_por_assessor") stateFilter = "Finalizado";
      if (reportType === "nao_iniciadas") stateFilter = "Não iniciado";

      console.log(`Buscando tarefas com estado: ${stateFilter}`);
      const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .eq("estado", stateFilter)
        .neq("descricao", "");
      if (error) {
        console.error("Erro ao buscar relatório:", error);
      } else {
        console.log("Dados do relatório:", data);
        setReportData(data);
      }
    }
  }

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-hidden relative">
        <button
          onClick={() => {
            console.log("Modal fechado.");
            closeModal();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          X
        </button>

        <h2 className="text-xl font-bold mb-4">Relatório</h2>

        <select
          className="border p-2 mb-4 w-full"
          value={reportType}
          onChange={(e) => {
            console.log("Dropdown alterado para:", e.target.value);
            setReportType(e.target.value);
            setReportData([]); // Limpa o relatório ao trocar a opção
          }}
        >
          <option value="iniciadas_por_assessor">Tarefas Iniciadas</option>
          <option value="finalizadas_por_assessor">Tarefas Finalizadas</option>
          <option value="nao_iniciadas">Tarefas Não Iniciadas</option>
          <option value="nao_selecionadas">Tarefas Não Selecionadas</option>
        </select>

        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Gerar Relatório
        </button>

        {totalTasksCount > 0 && (
          <p className="mb-4">
            {reportData.length} tarefas de um total de {totalTasksCount} tarefas estão neste relatório.
          </p>
        )}

        <div ref={scrollContainerRef} className="max-h-[400px] overflow-y-auto border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              {reportType === "nao_selecionadas" ? (
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Tarefa</th>
                </tr>
              ) : (
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Assessor</th>
                  <th className="border px-4 py-2">Tarefa</th>
                  <th className="border px-4 py-2">Estado</th>
                </tr>
              )}
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {reportType === "nao_selecionadas" ? (
                    // Na tabela "tasks", a coluna com a descrição é "task"
                    <td className="border px-4 py-2">{item.task}</td>
                  ) : (
                    <>
                      <td className="border px-4 py-2">
                        {item.registros && item.registros.assessor ? item.registros.assessor : "N/A"}
                      </td>
                      {/* Usa "descricao" se disponível (tarefas da tabela "tarefas"); caso contrário, utiliza "task" */}
                      <td className="border px-4 py-2">{item.descricao || item.task}</td>
                      <td className="border px-4 py-2">{item.estado}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;
};

export default ReportModal;
