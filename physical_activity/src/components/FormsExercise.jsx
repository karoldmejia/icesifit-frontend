import React from "react";

import IconTextButton from "@/components/IconTextButton.jsx";
import { CircleMinus, Plus, Minus } from "lucide-react";

// Fila editable tipo ExerciseRow
function FormExerciseRow({ exerciseId, seriesId, reps, time, rowIndex, onChange, deleteSeries }) {
    const bgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]";

    return (
        <div className={`w-full ${bgColor}`}>
            <div className="grid grid-cols-4 gap-2 py-1 px-4 items-center">
                {/* Número de serie */}
                <span className="font-medium text-gray-800">{rowIndex + 1}</span>

                {/* Reps */}
                <input
                    type="number"
                    value={reps}
                    onChange={(e) => onChange(exerciseId, seriesId, "reps", Number(e.target.value))}
                    className="p-1 w-16 bg-transparent focus:outline-none focus:ring-0"
                />

                {/* Tiempo */}
                <input
                    type="number"
                    value={time}
                    onChange={(e) => onChange(exerciseId, seriesId, "time", Number(e.target.value))}
                    className="p-1 w-16 bg-transparent focus:outline-none focus:ring-0"
                />

                {/* Botón eliminar */}
                <button
                    onClick={() => deleteSeries(exerciseId, seriesId)}
                    className="ml-auto text-gray-500 hover:text-gray-400 p-1 rounded"

                >
                    <Minus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Card completa tipo ExerciseDetailCard con imagen
export default function FormsExercise({ exercise, onChange, addSeries, deleteSeries, deleteExercise }) {
    // exercise: { exerciseId, name, media: [{ src }], series: [{ id, reps, time }] }

    return (
        <div className="p-4 mb-2 rounded-lg bg-white">
            <div className="mb-2 p-0 group relative">
                {/* Fila principal */}
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {exercise.media?.[0]?.src ? (
                            <img
                                src={exercise.media[0].src}
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400 text-xs">No media</span>
                        )}
                    </div>

                    <span className="font-semibold text-lg">{exercise.name}</span>

                    {/* Botón eliminar */}
                    <button
                        onClick={() => deleteExercise(exercise.routineExerciseId)}
                        className="
                absolute right-2 top-1/2 -translate-y-1/2
                opacity-0 group-hover:opacity-100
                transition
                text-red-500 hover:text-red-600 p-2
            "
                    >
                        <CircleMinus className="w-6 h-6" />
                    </button>
                </div>
            </div>


            {/* Encabezado de columnas tipo grid */}
            <div className="grid grid-cols-4 gap-2 pb-1 mb-1">
                <span className="text-xs text-gray-500">SERIE</span>
                <span className="text-xs text-gray-500">REPS</span>
                <span className="text-xs text-gray-500">TIEMPO</span>
            </div>

            {/* Filas editables de series */}
            <div className="flex flex-col">
                {exercise.series.map((s, idx) => (
                    <FormExerciseRow
                        key={s.id}
                        exerciseId={exercise.exerciseId}
                        seriesId={s.id}
                        reps={s.reps}
                        time={s.time}
                        rowIndex={idx}
                        onChange={onChange}
                        deleteSeries={deleteSeries}
                    />
                ))}
            </div>

            {/* Botón para agregar serie */}
            {addSeries && (
                <div className="mt-2 w-full">
                    <IconTextButton
                        icon={Plus}
                        text="Agregar serie"
                        onClick={() => addSeries(exercise.exerciseId)}
                        className="w-full justify-center" // ancho completo y centrado
                    />
                </div>
            )}
        </div>
    );
}
