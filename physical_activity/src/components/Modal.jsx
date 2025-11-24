const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Contenedor del modal */}
            <div
                className="bg-white rounded-lg shadow-lg h-[600px] max-h-[90vh] p-6 pt-10 relative flex flex-col inline-block max-w-[90vw]"
                style={{ minWidth: "300px" }} // opcional: ancho mínimo para pantallas muy pequeñas
            >
                {/* Botón de cerrar */}
                <button
                    className="absolute top-3 right-6 text-gray-500 text-4xl hover:text-gray-800"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Contenido con scroll */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-none">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
