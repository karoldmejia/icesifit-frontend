import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { assignTrainer, deleteAssignment, fetchAssignmentsByUser } from "@/services/assignmentServices";
import { fetchTrainers } from "@/services/userServices";
import { UserCheck, Trash2 } from "lucide-react";
import Modal from "@/components/Modal.jsx";
import IconButton from "@/components/IconButton.jsx";

const AssignTrainerModal = ({ isOpen, onClose, user, onAssign, onUnassign }) => {
    const token = useSelector(state => state.user.token);
    const [trainers, setTrainers] = useState([]);
    const [currentAssignments, setCurrentAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [selectedTrainer, setSelectedTrainer] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [deletingAssignment, setDeletingAssignment] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setAssignmentsLoading(true);

                // Cargar entrenadores y asignaciones en paralelo
                const [trainersData, assignmentsData] = await Promise.all([
                    fetchTrainers(token),
                    fetchAssignmentsByUser(user.id, token)
                ]);

                setTrainers(trainersData);
                setCurrentAssignments(assignmentsData);
            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                setLoading(false);
                setAssignmentsLoading(false);
            }
        }

        if (isOpen && user) {
            loadData();
        }
    }, [isOpen, user, token]);

    const handleAssign = async () => {
        if (!selectedTrainer) return;

        try {
            setAssigning(true);
            const result = await assignTrainer(selectedTrainer, user.id, token);
            onAssign(user.id, selectedTrainer, result);

            // Recargar asignaciones después de asignar
            const updatedAssignments = await fetchAssignmentsByUser(user.id, token);
            setCurrentAssignments(updatedAssignments);
            setSelectedTrainer("");
        } catch (err) {
            console.error("Error asignando entrenador:", err);
        } finally {
            setAssigning(false);
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            setDeletingAssignment(assignmentId);
            await deleteAssignment(assignmentId, token);
            onUnassign(user.id, assignmentId);

            // Actualizar lista de asignaciones
            const updatedAssignments = await fetchAssignmentsByUser(user.id, token);
            setCurrentAssignments(updatedAssignments);
        } catch (err) {
            console.error("Error eliminando asignación:", err);
        } finally {
            setDeletingAssignment(null);
        }
    };

    // Filtrar entrenadores que ya están asignados
    const availableTrainers = trainers.filter(trainer =>
        !currentAssignments.some(assignment => assignment.trainerId === trainer.id)
    );

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} bgColor={"#323132"}>
            <div className="p-6">
                <h2 className="text-sm text-gray-400 font-medium mb-4">Gestionar entrenadores de {user.name}</h2>

                {/* Sección de asignaciones actuales */}
                <div className="mb-6">
                    <h3 className="text-sm text-gray-200 font-medium mb-3">ENTRENADORES ASIGNADOS</h3>

                    {assignmentsLoading ? (
                        <div className="text-center py-4">
                            <p>Cargando asignaciones...</p>
                        </div>
                    ) : currentAssignments.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-gray-500">No hay entrenadores asignados</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {currentAssignments.map(assignment => (
                                <div
                                    key={assignment.id}
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-[#363636]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <UserCheck className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{assignment.trainerName}</p>
                                            <p className="text-xs text-gray-300">
                                                Asignado el {new Date(assignment.assignmentDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <IconButton
                                        icon={Trash2}
                                        onClick={() => handleDeleteAssignment(assignment.id)}
                                        disabled={deletingAssignment === assignment.id}
                                        className="hover:text-red-700 hover:bg-red-50"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección para asignar nuevo entrenador */}
                <div className="border-t border-gray-600 pt-6">
                    <h3 className="text-sm text-gray-200 font-medium mb-3">ASIGNAR NUEVO ENTRENADOR</h3>

                    {loading ? (
                        <div className="text-center py-4">
                            <p>Cargando entrenadores...</p>
                        </div>
                    ) : availableTrainers.length === 0 ? (
                        <div className="bg-yellow-50 rounded-lg p-4 text-center">
                            <p className="text-yellow-700">No hay entrenadores disponibles para asignar</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <select
                                value={selectedTrainer}
                                onChange={(e) => setSelectedTrainer(e.target.value)}
                                className="w-full p-3 bg-[#363636] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                <option value="">Selecciona un entrenador</option>
                                {availableTrainers.map(trainer => (
                                    <option key={trainer.id} value={trainer.id}>
                                        {trainer.name} - {trainer.institutionalEmail}
                                    </option>
                                ))}
                            </select>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={handleAssign}
                                    disabled={!selectedTrainer || assigning}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {assigning ? "Asignando..." : "Asignar entrenador"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default AssignTrainerModal;