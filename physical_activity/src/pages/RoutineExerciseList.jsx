import RoutineExerciseRow from "@/components/RoutineExerciseRow.jsx";

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
