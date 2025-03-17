const Modal = ({ isOpen, closeModal, column, value, setValue, handleSave }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Editar {column}</h2>
                <input
                    type="text"
                    className="w-full border p-2"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={closeModal}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
