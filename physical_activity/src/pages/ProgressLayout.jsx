// components/ProgressLayout.jsx (versión actualizada)
import React from "react";
import SplitLayout from "@/components/SplitLayout.jsx";
import ProgressCard from "@/components/ProgressCard.jsx";

const ProgressLayout = ({
                            userRoutines,
                            selectedRoutine,
                            onSelectRoutine,
                            loading,
                            error,
                            leftHeader // Nuevo prop opcional
                        }) => {
    return (
        <SplitLayout
            showLeft={true}
            backgroundColor="bg-transparent"
            lineColor={"bg-gray-700"}
            left={
                <div className="space-y-4 p-4">
                    {leftHeader || (
                        // Contenido por defecto si no se proporciona leftHeader
                        <>
                            <h2 className="text-sm font-bold mb-4 text-gray-300">MÉTRICAS</h2>
                            <div className="space-y-2">
                                <div className="p-3 border border-gray-600 rounded-lg bg-[#323132]">
                                    <p className="text-gray-400 text-sm">Rutinas activas: {userRoutines.length}</p>
                                </div>
                                <div className="p-3 border border-gray-600 rounded-lg bg-[#323132]">
                                    <p className="text-gray-400 text-sm">Progreso total: {userRoutines.reduce((total, routine) => total + routine.progress.length, 0)} registros</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            }
            right={
                <div className="space-y-4 p-4">
                    <h2 className="text-sm font-bold mb-4 text-gray-300">MIS RUTINAS</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-400">Cargando rutinas...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : userRoutines.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No tienes rutinas asignadas
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userRoutines.map(routine => (
                                <ProgressCard
                                    key={routine.userRoutineId}
                                    routine={routine}
                                    isSelected={selectedRoutine?.userRoutineId === routine.userRoutineId}
                                    onSelect={() => onSelectRoutine(routine)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default ProgressLayout;