// LoginSenhaModal.jsx
import React from "react";

const LoginSenhaModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  const tableData = [
    { gabinete: "GCIV0101", juiz: "Machado de Assis", login: "M_ASSIS", cpf: "31050112008", senha: "Senha@1234567" },
    { gabinete: "GCIV0102", juiz: "Euclides da Cunha", login: "E_CUNHA", cpf: "64492634070", senha: "Senha@1234567" },
    { gabinete: "GCIV0103", juiz: "Raquel de Queiroz", login: "R_QUEIROZ", cpf: "64200041014", senha: "Senha@1234567" },
    { gabinete: "GCIV0104", juiz: "Mia Couto", login: "M_COUTO", cpf: "9801649070", senha: "Senha@1234567" },
    { gabinete: "GCRI0101", juiz: "Adélia Prado", login: "A_PRADO", cpf: "78156161009", senha: "Senha@1234567" },
    { gabinete: "GCRI0102", juiz: "Cecília Meireles", login: "C_MEIRELES", cpf: "9789462000", senha: "Senha@1234567" },
    { gabinete: "GCRI0103", juiz: "Humberto Eco", login: "H_ECO", cpf: "30605267022", senha: "Senha@1234567" },
    { gabinete: "GCRI0104", juiz: "Manuel Bandeira", login: "M_BANDEIRA", cpf: "45950174054", senha: "Senha@1234567" },
    { gabinete: "GPUB0101", juiz: "Tarsila do Amaral", login: "T_AMARAL", cpf: "71616917024", senha: "Senha@1234567" },
    { gabinete: "GPUB0102", juiz: "Mario Quintana", login: "M_QUINTANA", cpf: "14731181070", senha: "Senha@1234567" },
    { gabinete: "GPUB0103", juiz: "Joana D’Arc", login: "J_DARC", cpf: "17359839009", senha: "Senha@1234567" },
    { gabinete: "GPUB0104", juiz: "José Saramago", login: "J_SARAMAGO", cpf: "47065639096", senha: "Senha@1234567" }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
        <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Login e Senha de Magistrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Gabinete</th>
                <th className="border px-4 py-2">Juiz</th>
                <th className="border px-4 py-2">Login</th>
                <th className="border px-4 py-2">CPF</th>
                <th className="border px-4 py-2">Senha</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{row.gabinete}</td>
                  <td className="border px-4 py-2">{row.juiz}</td>
                  <td className="border px-4 py-2">{row.login}</td>
                  <td className="border px-4 py-2">{row.cpf}</td>
                  <td className="border px-4 py-2">{row.senha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginSenhaModal;
