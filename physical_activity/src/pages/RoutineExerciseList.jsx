import React from "react";

import RoutineExerciseRow from "@/components/RoutineExerciseRow.jsx";
import PropTypes from "prop-types";

export default function RoutineExerciseList({ exercises, onSelectExercise }) {
    if (!exercises || exercises.length === 0) {
        return <p>No hay ejercicios en esta rutina</p>;
    }

    return (
        <div className="bg-white w-full h-full overflow-y-auto">
            <span className="text-sm mb-5 mr-auto text-gray-400">Ejercicios</span>
            <ul className="flex flex-col mt-3 gap-2">
                {exercises.map(ex => (
                    <RoutineExerciseRow
                        key={ex.id}
                        exercise={ex}
                        onClick={() => onSelectExercise(ex)}
                    />
                ))}
            </ul>
        </div>
    );
}
RoutineExerciseList.propTypes = {
    exercises: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            exerciseId: PropTypes.number,
            name: PropTypes.string,
            media: PropTypes.string,
            sets: PropTypes.number,
            reps: PropTypes.number,
            time: PropTypes.number,
        })
    ).isRequired,
    onSelectExercise: PropTypes.func,
};
