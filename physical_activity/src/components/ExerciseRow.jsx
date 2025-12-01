import React from "react";

export default function ExerciseRow({ setNumber, reps, time, showReps, showTime, rowIndex }) {
    const bgColor = rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f7f7f7]';

    return (
        <div className={`w-full ${bgColor}`}> {/* w-full para ocupar toda la card */}
            <div className="grid grid-cols-3 gap-2 py-1 px-4"> {/* grid dentro, con padding */}
                <span className="font-medium text-gray-800">{setNumber}</span>
                {showReps && <span className="font-medium text-gray-800">{reps}</span>}
                {showTime && <span className="font-medium text-gray-800">{time ? `${Math.floor(time / 60)}m ${time % 60}s` : "-"}</span>}
            </div>
        </div>
    );
}
