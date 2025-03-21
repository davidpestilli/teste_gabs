import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import TableRow from "./TableRow";
import TaskActions from "./TaskActions";
import ReportModal from "./ReportModal"; // Modal para relatórios
import TaskModal from "./TaskModal";
import AddAssessorModal from "./AddAssessorModal"; // Novo modal para adicionar assessor com processos
import DevContactModal from "./DevContactModal"; // Importa o modal de contato

const Table = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isAddAssessorModalOpen, setAddAssessorModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [currentTaskRegistroId, setCurrentTaskRegistroId] = useState(null);

    // Novo estado para o modal de contato com os devs
    const [isDevModalOpen, setDevModalOpen] = useState(false);

    // Estados para o filtro
    const [filtroAssessor, setFiltroAssessor] = useState("");
    const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    let { data, error } = await supabase.from("registros").select("*, tarefas(*)");
    if (error) console.error("Erro ao buscar dados:", error);
    else setDados(data);
    setLoading(false);
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
    if (!window.confirm("Tem certeza que deseja excluir os processos selecionados?")) return;

    const { error } = await supabase.from("registros").delete().in("id", selectedRows);
    if (error) console.error("Erro ao excluir linhas:", error);
    else {
        setSelectedRows([]);
        carregarDados();
    }
}


  async function updateCell(id, column, value) {
    console.log(`Atualizando ${column} do registro ID ${id} para: ${value}`);
    const { error } = await supabase
      .from("registros")
      .update({ [column]: value })
      .eq("id", id);
    if (error) {
      console.error("Erro ao atualizar registro:", error);
    } else {
      console.log("Registro atualizado com sucesso!");
      carregarDados();
    }
  }

  const handleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

    // Função para selecionar/deselecionar todas as linhas
    const handleSelectAll = () => {
      if (selectedRows.length === dados.length) {
        setSelectedRows([]);
      } else {
        const allIds = dados.map((registro) => registro.id);
        setSelectedRows(allIds);
      }
    };

  const openTaskModal = (registroId) => {
    setCurrentTaskRegistroId(registroId);
    setTaskModalOpen(true);
  };

    // Funções para o filtro de assessor
    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFiltroAssessor(value);
        if (value.length >= 2) {
          fetchAssessorSuggestions(value);
        } else {
          setSuggestions([]);
        }
      };

      async function fetchAssessorSuggestions(value) {
        const { data, error } = await supabase
          .from("registros")
          .select("assessor")
          .ilike("assessor", `%${value}%`);
        if (error) {
          console.error("Erro ao buscar sugestões:", error);
        } else {
          const uniqueNames = [...new Set(data.map(item => item.assessor).filter(Boolean))];
          setSuggestions(uniqueNames);
        }
      }
    
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyFilter();
        }
      };
    
      async function applyFilter() {
        const { data, error } = await supabase
          .from("registros")
          .select("*")
          .ilike("assessor", `%${filtroAssessor}%`);
        if (error) {
          console.error("Erro ao filtrar dados:", error);
        } else {
          setDados(data);
          setSuggestions([]);
        }
      }
    
      const handleSuggestionClick = (suggestion) => {
        setFiltroAssessor(suggestion);
        setSuggestions([]);
        applyFilter();
      };
    
      const clearFilter = () => {
        setFiltroAssessor("");
        carregarDados();
      };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Testes pelos Gabinetes</h2>

            {/* Caixa de filtro para o assessor */}
            <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Filtrar por Assessor"
          className="border p-2 w-full"
          value={filtroAssessor}
          onChange={handleFilterChange}
          onKeyDown={handleKeyDown}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border w-full z-10">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {filtroAssessor && (
          <button onClick={clearFilter} className="mt-2 text-sm text-blue-500">
            Limpar filtro
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <TaskActions
          addTask={addRow}
          deleteSelectedTasks={deleteRows}
          selectedTasks={selectedRows}
          setReportModalOpen={setReportModalOpen}
        />
 
        <button
          onClick={() => setAddAssessorModalOpen(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded whitespace-nowrap h-10"
        >
          Adicionar Assessor com Processos
        </button>
      </div>

              <div className="flex items-center gap-2 ml-4">

          <div className="relative group">
            <a href="https://companion.example.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 21h6l-.75-4M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7" />
              </svg>
            </a>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              Companion App
            </span>
          </div>


          <div className="relative group">
            <a href="https://bugs.example.com" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2v2h3.09a8.001 8.001 0 010 16H13v2h-2v-2H7.91a8.001 8.001 0 010-16H11V2h2zM12 4c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4zm0 16c2.21 0 4-1.79 4-4H8c0 2.21 1.79 4 4 4z"/>
              </svg>
            </a>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              Relatar Bugs
            </span>
          </div>


          <div className="relative group">
            <button onClick={() => setDevModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              Contato Dev
            </span>
          </div>

 
          <div className="relative group">
            <a href="" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              ChatGPT 1
            </span>
          </div>


          <div className="relative group">
            <a href="" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              ChatGPT 2
            </span>
          </div>


          <div className="relative group">
            <a href="/manual.pdf" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l9-5-9-5-9 5 9 5z" />
              </svg>
            </a>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
              Manual
            </span>
          </div>
        </div>


      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
              <th className="border px-4 py-4 flex justify-start items-center">
                <input 
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === dados.length && dados.length > 0}
                />
                </th>
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
                  updateCell={updateCell}
                  isSelected={selectedRows.includes(registro.id)}
                  toggleSelection={() => handleRowSelection(registro.id)}
                  openTaskModal={() => openTaskModal(registro.id)}
                />
              ))}
            </tbody>
          </table>

          <TaskModal
            isOpen={isTaskModalOpen}
            closeModal={() => setTaskModalOpen(false)}
            registroId={currentTaskRegistroId}
          />
        </div>
      )}

      {isReportModalOpen && (
        <ReportModal
          isOpen={true}
          closeModal={() => {
            console.log("Fechando modal de relatório...");
            setReportModalOpen(false);
          }}
        />
      )}

      {isAddAssessorModalOpen && (
        <AddAssessorModal
          isOpen={isAddAssessorModalOpen}
          closeModal={() => setAddAssessorModalOpen(false)}
          refreshData={carregarDados}
        />
      )}
            {/* Modal de contato com os desenvolvedores */}
            <DevContactModal isOpen={isDevModalOpen} closeModal={() => setDevModalOpen(false)} />
    </div>
  );
};

export default Table;
