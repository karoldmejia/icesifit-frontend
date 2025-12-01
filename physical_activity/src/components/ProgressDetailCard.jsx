import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ExerciseRow from './ExerciseRow';
import IconButton from "@/components/IconButton.jsx";
import { Trash2, MessageCircle, Send } from "lucide-react";
import ConfirmationCard from "@/components/ConfirmationCard.jsx";
import { fetchRecommendationsByUser, createRecommendation } from "@/services/recommendationServices";
import { fetchAssignmentsByUser } from "@/services/assignmentServices";

export default function ProgressDetailCard({ exercise, progressData, onDeleteProgress }) {
    const token = useSelector(state => state.user.token);
    const currentUserId = useSelector(state => state.user.id);
    const userRole = useSelector(state => state.user.role);

    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssignedTrainer, setIsAssignedTrainer] = useState(false);
    const [loadingAssignmentCheck, setLoadingAssignmentCheck] = useState(false);

    // Procesar UN solo registro de progreso
    const processSingleProgress = (progressItem) => {
        if (!progressItem) return [];

        const sets = progressItem.setsCompleted || 0;
        const reps = progressItem.repsCompleted || 0;
        const time = progressItem.timeCompleted || 0;
        const date = progressItem.progressDate;

        // Crear filas para cada set
        return Array.from({ length: sets }, (_, setIndex) => ({
            setNumber: setIndex + 1,
            reps: reps,
            time: time,
            date: date,
            globalIndex: setIndex
        }));
    };

    // Solo procesamos el primer item (debería ser el único)
    const singleProgress = progressData && progressData.length > 0 ? progressData[0] : null;
    const rows = processSingleProgress(singleProgress);
    const showReps = rows.some(row => row.reps && row.reps > 0);
    const showTime = rows.some(row => row.time && row.time > 0);

    const displayDate = singleProgress ?
        new Date(singleProgress.progressDate).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "2-digit"
        }) : "Sin fecha";

    // Verificar si el entrenador está asignado al usuario y cargar recomendaciones
    useEffect(() => {
        if (showRecommendations && singleProgress?.id) {
            checkTrainerAssignmentAndLoadRecommendations();
        }
    }, [showRecommendations, singleProgress?.id]);

    const checkTrainerAssignmentAndLoadRecommendations = async () => {
        try {
            setLoadingAssignmentCheck(true);
            setLoadingRecommendations(true);

            // Si es trainer, verificar si está asignado al usuario
            if (userRole === "ROLE_Trainer" && singleProgress?.userId) {
                const userAssignments = await fetchAssignmentsByUser(singleProgress.userId, token);
                const isAssigned = userAssignments.some(
                    assignment => assignment.trainerId === currentUserId
                );
                setIsAssignedTrainer(isAssigned);
            } else {
                setIsAssignedTrainer(false);
            }

            // Cargar recomendaciones
            const userRecommendations = await fetchRecommendationsByUser(singleProgress.userId || currentUserId, token);
            const progressRecommendations = userRecommendations.filter(
                rec => rec.progressId === singleProgress.id
            );
            setRecommendations(progressRecommendations);

        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoadingAssignmentCheck(false);
            setLoadingRecommendations(false);
        }
    };

    const handleDelete = async () => {
        if (!singleProgress?.id) return;

        setIsDeleting(true);
        try {
            await onDeleteProgress(singleProgress.id);
            setShowConfirm(false);
        } catch (error) {
            console.error("Error eliminando progreso:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleComment = () => {
        setShowRecommendations(!showRecommendations);
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !singleProgress?.id) return;

        setIsSubmitting(true);
        try {
            if (userRole === "ROLE_Trainer" && isAssignedTrainer) {
                await createRecommendation(currentUserId, singleProgress.id, newComment.trim(), token);
                setNewComment("");
                // Recargar recomendaciones
                await checkTrainerAssignmentAndLoadRecommendations();
            } else {
                console.log("No tienes permisos para crear recomendaciones");
            }
        } catch (error) {
            console.error("Error creando recomendación:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mb-2 rounded-lg bg-white">
            {/* Header del ejercicio con botones */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {exercise.media ? (
                        <img src={exercise.media} alt={exercise.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-xs text-center">No media</span>
                    )}
                </div>
                <div className="flex-1">
                    <span className="font-semibold text-xl text-gray-900 block">{exercise.name}</span>
                    <span className="text-sm text-gray-500">
                        Progreso del {displayDate}
                    </span>
                </div>

                {/* Botones de acción - alineados a la derecha */}
                <div className="flex gap-2">
                    {/* Botón de comentario */}
                    <IconButton
                        icon={MessageCircle}
                        onClick={handleComment}
                        className={`${showRecommendations ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} hover:text-blue-600`}
                    />

                    {/* Botón de eliminar */}
                    <IconButton
                        icon={Trash2}
                        onClick={() => setShowConfirm(true)}
                        className="text-gray-600 hover:text-red-600"
                        disabled={isDeleting}
                    />
                </div>
            </div>

            {/* Área de recomendaciones desplegable */}
            {showRecommendations && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-semibold text-xs mb-4 text-gray-400">RECOMENDACIONES</h3>
                    {userRole === "ROLE_Trainer" && isAssignedTrainer && (
                        <div className="mb-4 bg-transparent rounded-lg border border-gray-200 relative">
                            <div className="flex items-start gap-3 relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escribe tu recomendación para este progreso..."
                                    className="flex-1 p-3 text-gray-600 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                                    rows="3"
                                />

                                {/* Contenedor con posicionamiento absoluto */}
                                <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                                    <IconButton
                                        icon={Send}
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim() || isSubmitting}
                                        color={"bg-gray-200"}
                                        className={`w-10 h-10 flex items-center justify-center ${
                                            !newComment.trim() || isSubmitting
                                                ? 'bg-gray-200 text-gray-100 cursor-not-allowed'
                                                : 'bg-blue-600 text-gray-100 hover:bg-gray-300'
                                        }`}
                                    />
                                    {isSubmitting && (
                                        <div className="w-10 text-center">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mx-auto"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje para trainers no asignados */}

                    {/* Lista de recomendaciones existentes */}
                    {loadingRecommendations ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500">Cargando recomendaciones...</p>
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">No hay recomendaciones para este progreso</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recommendations.map((recommendation) => (
                                <div
                                    key={recommendation.id}
                                    className="p-3 bg-white rounded-lg border border-gray-200"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-xs text-gray-600">
                                            {recommendation.trainerName || 'Entrenador'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(recommendation.recommendationDate || recommendation.assignmentDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{recommendation.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Información adicional del progreso */}
            {(singleProgress?.notes || singleProgress?.weight) && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    {singleProgress.notes && (
                        <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Notas:</span> {singleProgress.notes}
                        </p>
                    )}
                    {singleProgress.weight && (
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Peso:</span> {singleProgress.weight} kg
                        </p>
                    )}
                </div>
            )}

            {/* Encabezado de la tabla */}
            <div className="grid grid-cols-3 gap-2 pb-3">
                <span className="text-sm font-medium text-gray-700">SERIE</span>
                {showReps && <span className="text-sm font-medium text-gray-700">REPS</span>}
                {showTime && <span className="text-sm font-medium text-gray-700">TIEMPO</span>}
            </div>

            {/* Contenido de la tabla - solo los sets de este progreso específico */}
            <div className="rounded-lg overflow-hidden border border-gray-200">
                {rows.map((row, index) => (
                    <ExerciseRow
                        key={row.globalIndex}
                        setNumber={row.setNumber}
                        reps={row.reps}
                        time={row.time}
                        showReps={showReps}
                        showTime={showTime}
                        rowIndex={index}
                    />
                ))}
            </div>

            {/* Mensaje si no hay datos */}
            {rows.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                        No hay datos de sets para este registro
                    </p>
                </div>
            )}

            {/* Modal de confirmación para eliminar */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <ConfirmationCard
                        title="¿Eliminar progreso?"
                        description="Esta acción no se puede deshacer. Se perderán los datos de este registro."
                        onDeactivate={handleDelete}
                        onCancel={() => setShowConfirm(false)}
                        loading={isDeleting}
                    />
                </div>
            )}
        </div>
    );
}