import { useState } from "react";
import Modal from "@/components/Modal.jsx";
import IconButton from "@/components/IconButton.jsx";
import { ClipboardPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { createRoutine } from "@/services/routineServices.js";

export default function CreateRoutineEmpty({ setAlert, refreshRoutines }) {
    const token = useSelector(state => state.user.token);
    const userRole = useSelector(state => state.user.role);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [routineName, setRoutineName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRoutineName("");
    };

    const handleCreateRoutine = async () => {
        if (!routineName.trim()) {
            setAlert({ type: "error", message: "Debes escribir un nombre", show: true });
            return;
        }

        setIsCreating(true);
        try {
            // Crear rutina vacía
            await createRoutine({ name: routineName, exercises: [], certified: true, creationDate: new Date().toISOString()}, token);

            setAlert({ type: "success", message: "Rutina creada correctamente", show: true });
            refreshRoutines();
            handleCloseModal();
        } catch (err) {
            console.error(err);
            setAlert({ type: "error", message: "Error creando rutina", show: true });
        } finally {
            setIsCreating(false);
        }
    };

    // Solo entrenadores pueden ver el botón
    if (userRole !== "ROLE_Trainer") return null;

    return (
        <>
            <IconButton
                icon={ClipboardPlus}
                onClick={() => setIsModalOpen(true)}
                size="w-10 h-10"
                color="bg-[#323132]"
                textColor="text-white"
                className="mr-2"
            />

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} bgColor="#1A1A1A">
                    <div className="p-6">
                        <h2 className="text-sm font-medium text-gray-300 mb-4">Crear nueva rutina desde cero</h2>
                        <input
                            type="text"
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            placeholder="Nombre de la rutina"
                            className="w-full p-2 mb-4 rounded bg-[#323132] text-white border border-gray-600 focus:outline-none focus:ring-0"
                        />
                        <button
                            onClick={handleCreateRoutine}
                            disabled={isCreating}
                            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isCreating ? "Creando..." : "Crear rutina"}
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
