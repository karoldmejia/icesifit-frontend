import ExerciseRow from './ExerciseRow';

export default function ExerciseDetailCard({ exercise }) {
    const showReps = exercise.details.some(d => d.reps && d.reps > 0);
    const showTime = exercise.details.some(d => d.time && d.time > 0);

    // Generamos todas las filas con su índice
    const rows = exercise.details?.flatMap((d, idx) =>
        Array.from({ length: d.sets || 0 }, (_, i) => ({
            setNumber: i + 1,
            reps: d.reps,
            time: d.time,
        }))
    ) || [];

    return (
        <div className="p-4 mb-2 pt-0 rounded-lg bg-white">
            {/* Fila principal: video/gif + nombre */}
            <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {exercise.media?.[0]?.src ? (
                        <img src={exercise.media[0].src} alt={exercise.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400 text-xs">No media</span>
                    )}
                </div>
                <span className="font-semibold text-lg">{exercise.name}</span>
            </div>

            {/* Encabezado de columnas */}
            <div className="grid grid-cols-3 gap-2 pb-1 mb-1">
                <span className="text-xs text-gray-500">SERIE</span>
                {showReps && <span className="text-xs text-gray-500">REPS</span>}
                {showTime && <span className="text-xs text-gray-500">TIEMPO</span>}
            </div>

            {/* Filas con series, repeticiones y tiempo */}
            <div className="flex-1 flex-col">
                {rows.map((row, idx) => (
                    <ExerciseRow
                        key={idx}
                        setNumber={row.setNumber}
                        reps={row.reps}
                        time={row.time}
                        showReps={showReps}
                        showTime={showTime}
                        rowIndex={idx} // para alternar colores
                    />
                ))}
            </div>
        </div>
    );
}
