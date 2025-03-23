import * as XLSX from "xlsx";
import { supabase } from "../services/supabaseClient";

const exportUnifiedReportToExcel = async () => {
  // Consulta para tarefas não selecionadas (tabela "tasks")
  const { data: allTasks, error: errAllTasks } = await supabase
    .from("tasks")
    .select("*");
  if (errAllTasks) {
    console.error("Erro ao buscar tasks:", errAllTasks);
    return;
  }

  // Consulta para tarefas atribuídas (tabela "tarefas" com join em "registros")
  const { data: assignedTasks, error: errAssignedTasks } = await supabase
    .from("tarefas")
    .select("*, registros(assessor, gabinete, processos)")
    .neq("descricao", "");
  if (errAssignedTasks) {
    console.error("Erro ao buscar tarefas:", errAssignedTasks);
    return;
  }

  // Formatação das tarefas atribuídas
  const formattedAssigned = assignedTasks.map(task => ({
    "Assessor": task.registros?.assessor || "",
    "Gabinete": task.registros?.gabinete || "",
    "Processos": task.registros?.processos || "",
    "Tarefa": task.descricao || task.task || "",
    "Estado": task.estado || "",
    "Observações": task.observacoes || "",
    "Tipo de Relatório": task.estado === "Iniciado"
      ? "Tarefa Iniciada"
      : task.estado === "Finalizado"
      ? "Tarefa Finalizada"
      : task.estado === "Não iniciado"
      ? "Tarefa Não Iniciada"
      : "Atribuída"
  }));

  // Formatação das tarefas não selecionadas
  const formattedNonSelected = allTasks.map(task => ({
    "Assessor": "",
    "Gabinete": "",
    "Processos": "",
    "Tarefa": task.task || "",
    "Estado": "Não Atribuída",
    "Observações": "",
    "Tipo de Relatório": "Tarefa Não Selecionada"
  }));

  // Combina os dados em um único array
  const unifiedData = [...formattedAssigned, ...formattedNonSelected];

  // Converte o array de objetos em uma planilha
  const worksheet = XLSX.utils.json_to_sheet(unifiedData);
  // Cria um novo workbook e adiciona a planilha
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório Geral");

  // Salva o arquivo Excel
  XLSX.writeFile(workbook, "relatorio_geral.xlsx");
};

export default exportUnifiedReportToExcel;
