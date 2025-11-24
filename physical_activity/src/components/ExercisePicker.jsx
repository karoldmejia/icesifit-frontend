import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchExercises } from "@/services/exerciseServices.js";

export default function ExercisePicker({ selectedExercises, setSelectedExercises }) {
    const token = useSelector(state => state.user.token);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        fetchExercises(token)
            .then(data => {
                if (!mounted) return;
                setExercises(data);
            })
            .catch(err => {
                if (!mounted) return;
                setError("Error cargando ejercicios");
                console.error(err);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => { mounted = false; };
    }, [token]);

    const toggleExercise = (exercise) => {
        const exists = selectedExercises.find(e => e.id === exercise.id);
        if (exists) {
            setSelectedExercises(selectedExercises.filter(e => e.id !== exercise.id));
        } else {
            setSelectedExercises([...selectedExercises, exercise]);
        }
    };

    if (loading) return <p>Cargando ejercicios...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="h-full overflow-y-auto p-4">
            <h3 className="text-xl font-bold mb-4">Selecciona ejercicios</h3>
            <ul className="flex flex-col gap-2">
                {exercises.map(ex => (
                    <li
                        key={ex.id}
                        className={`p-2 rounded border cursor-pointer ${
                            selectedExercises.find(e => e.id === ex.id) ? "bg-blue-200" : "bg-white"
                        }`}
                        onClick={() => toggleExercise(ex)}
                    >
                        {ex.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
