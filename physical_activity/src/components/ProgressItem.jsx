export function ProgressItem({ media, date, sets, reps, time }) {

    const perSetReps = reps && sets > 0 ? Math.round(reps / sets) : 0;
    const perSetTime = time && sets > 0 ? Math.round(time / sets) : 0;

    let text = `${sets} sets`;
    if (perSetReps > 0) text += ` × ${perSetReps} reps`;
    if (perSetTime > 0) text += ` × ${perSetTime}s`;

    return (
        <div className="p-3 bg-gray-50 mb-2 rounded-md flex items-center gap-3">

            {/* Imagen */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {media ? (
                    <img src={media} className="w-full h-full object-cover"/>
                ) : (
                    <span className="text-[9px] text-gray-600 flex items-center justify-center h-full">
                        No img
                    </span>
                )}
            </div>

            {/* Info del progreso */}
            <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] text-gray-400">{date}</span>
                <span className="text-sm font-medium text-gray-800">{text}</span>
            </div>
        </div>
    );
}
