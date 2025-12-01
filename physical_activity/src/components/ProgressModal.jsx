import React from "react";
import { useState } from "react";
import SplitLayout from "../components/SplitLayout";
import ProgressDetails from "@/pages/ProgressDetails.jsx";
import ProgressExerciseList from "@/pages/ProgressExerciseList.jsx";
import ProgressDetailCard from "@/components/ProgressDetailCard";
import { deleteProgress } from "@/services/progressServices";
import { useSelector } from "react-redux";
import IconTextButton from "@/components/IconTextButton.jsx";
import { ArrowLeft } from "lucide-react";

export default function ProgressModal({ routine, onClose, onProgressDeleted }) {
    const [activeExercise, setActiveExercise] = useState(null);
    const [selectedProgress, setSelectedProgress] = useState(null);
    const token = useSelector(state => state.user.token);

    const handleSelectExercise = (exercise, progressItem) => {
        setActiveExercise(exercise);
        setSelectedProgress(progressItem);
    };

    const handleDeleteProgress = async (progressId) => {
        console.log("Eliminando progreso ID:", progressId);
        console.log("Token:", token ? "Presente" : "Faltante");

        try {
            await deleteProgress(progressId, token);
            console.log("Progreso eliminado exitosamente");

            // Cerrar todo: detalles y modal
            setActiveExercise(null);
            setSelectedProgress(null);

            // Llamar a la función de callback para notificar que se eliminó
            if (onProgressDeleted) {
                onProgressDeleted();
            }

            // Cerrar el modal completo
            onClose();

        } catch (error) {
            console.error("Error eliminando progreso:", error);
            throw error;
        }
    };

    return (
        <div className="w-full h-full">
            <SplitLayout
                showLeft={true}
                left={
                    <ProgressExerciseList
                        exercises={routine.exercises}
                        progress={routine.progress}
                        onSelectExercise={handleSelectExercise}
                    />
                }
                right={
                    activeExercise && selectedProgress ? (
                        <div className="p-4 h-full overflow-auto">
                            {/* Botón volver */}
                            <div className="flex items-center gap-3 mb-4">
                                <IconTextButton
                                    icon={ArrowLeft}
                                    text="Volver a rutina"
                                    onClick={() => {
                                        setActiveExercise(null);
                                        setSelectedProgress(null);
                                    }}
                                    textColor={"text-gray-700"}
                                />
                            </div>

                            {/* Pasar la función onDeleteProgress */}
                            <ProgressDetailCard
                                exercise={activeExercise}
                                progressData={[selectedProgress]}
                                onDeleteProgress={handleDeleteProgress}
                            />
                        </div>
                    ) : (
                        <ProgressDetails
                            routine={routine}
                            onSelectExercise={handleSelectExercise}
                        />
                    )
                }
            />
        </div>
    );
}