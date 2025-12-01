import React from "react";

import { CircleArrowOutUpRight } from "lucide-react";

export default function RoutineExerciseRow({ exercise, onClick, selected, onDetails, disableHover = false }) {

    return (
        <div
            onClick={onClick}
            className={`
                relative flex items-center gap-3 p-3 rounded-lg border transition
                cursor-pointer
            ${selected ? "bg-blue-200" : "bg-gray-50 hover:bg-gray-100"} }       
                 `}
        >
            {/* Imagen circular */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center flex-shrink-0">
                {exercise.media ? (
                    <img src={exercise.media} alt={exercise.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-600 text-center leading-tight">Sin<br/>media</span>
                )}
            </div>

            {/* Nombre */}
            <span className="font-medium text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                {exercise.name}
            </span>

            {/* Botón detalles ejercicio */}
            {!disableHover && (
                <button
                    className="
                        absolute right-3 p-2 rounded-full bg-white shadow
                        opacity-0 group-hover:opacity-100 transition
                    "
                    onClick={(e) => {
                        e.stopPropagation(); // evita que se active el toggle al hacer clic en detalles
                        onDetails?.();
                    }}
                >
                    <CircleArrowOutUpRight className="w-5 h-5 text-gray-700" />
                </button>
            )}
        </div>
    );
}
