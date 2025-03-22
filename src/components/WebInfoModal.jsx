// WebInfoModal.jsx
import React from "react";

const WebInfoModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] relative">
        <button 
          onClick={closeModal} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Portal, usuário e senha</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-bold">Portal</td>
                <td className="border px-4 py-2">https://eproc-2g-sp-hml.tjsp.jus.br/</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">Usuário</td>
                <td className="border px-4 py-2">TJSP_2G</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-bold">Senha</td>
                <td className="border px-4 py-2">Homologação$x4Bw2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebInfoModal;
