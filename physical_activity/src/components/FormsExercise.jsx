import IconTextButton from "@/components/IconTextButton.jsx";
import { Plus } from "lucide-react";

export default function FormsExercise({ exercise, onChange, addSeries }) {
    // exercise: { exerciseId, name, series: [{ id, reps, time }] }
    // onChange: callback para actualizar reps o time de una serie específica
    // addSeries: callback para agregar una serie al ejercicio

    return (
        <div className="p-4 rounded flex flex-col gap-4 bg-white">
            <h4 className="font-semibold">{exercise.name}</h4>

            {/* Encabezados alineados */}
            <div className="flex gap-4 font-medium text-sm text-gray-500">
                <span className="w-12">Series</span>
                <span className="w-16 text-center">Reps</span>
                <span className="w-16 text-center">Tiempo</span>
            </div>

            {/* Lista de series individuales */}
            <div className="flex flex-col gap-2">
                {exercise.series.map((s, idx) => (
                    <div key={s.id} className="flex gap-4 items-center">
                        <span className="w-16">{idx + 1}</span>
                        <input
                            type="number"
                            value={s.reps}
                            onChange={(e) =>
                                onChange(exercise.exerciseId, s.id, "reps", Number(e.target.value))
                            }
                            className="w-16"
                        />
                        <input
                            type="number"
                            value={s.time}
                            onChange={(e) =>
                                onChange(exercise.exerciseId, s.id, "time", Number(e.target.value))
                            }
                            className="w-16"
                        />
                    </div>
                ))}
            </div>

            {/* Botón para agregar serie */}
            {addSeries && (
                <div className="mt-2 flex justify-end">
                    <IconTextButton
                        icon={Plus}
                        text="Agregar serie"
                        onClick={() => addSeries(exercise.exerciseId)}
                    />
                </div>
            )}
        </div>
    );
}
