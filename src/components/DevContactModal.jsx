// DevContactModal.jsx
import React from "react";

const DevContactModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <button 
          onClick={closeModal} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Contato com os Desenvolvedores</h2>
        <div>
          <p><strong>Márcio do Nascimento</strong></p>
          <p>Email: marcionascimento@tjsp.jus.br</p>
        </div>
        <div className="mt-4">
          <p><strong>David de Souza Dichirico Pestilli</strong></p>
          <p>Email: dpestilli@tjsp.jus.br</p>
        </div>
        <div className="mt-4">
          <p><strong>Sandra Cristina Pamio Lopes</strong></p>
          <p>Email: sandrapamio@tjsp.jus.br</p>
        </div>
      </div>
    </div>
  );
};

export default DevContactModal;
