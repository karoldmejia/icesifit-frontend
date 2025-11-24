import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserBadge from "../components/UserBagde.jsx";
import SummaryExercise from "../components/SummaryExercise";
import { fetchWeeklyProgress } from "../services/progressServices.js";
import WeeklyRoutineChart from "../components/Charts/WeeklyRoutineChart.jsx";
import {
    fetchRoutineExercisesByRoutine,
    fetchExerciseById,
    fetchRoutineExercisesByUserRoutine
} from "../services/routineExerciseServices";
import ExerciseDetailCard from "@/components/ExerciseDetailCard.jsx";
import IconTextButton from "@/components/IconTextButton.jsx";
import IconButton from "@/components/IconButton.jsx";
import { Settings2, Trash2 } from "lucide-react";

const msToPretty = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

const transformToWeek = (progressArray) => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const last7 = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));

        const dayKey = d.toISOString().split("T")[0];

        const found = progressArray.find(p => p.date === dayKey);

        return {
            day: days[d.getDay()],
            count: found?.count || 0
        };
    });

    return last7;
};

export default function RoutineDetails({ routine, userRoutineId, onEdit }) {
    const token = useSelector(state => state.user.token);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        if (!routine?.routineId) return;

        let mounted = true;
        setLoading(true);
        setError(null);

        async function loadRoutineExercises() {
            try {
                const exercises = userRoutineId
                    ? await fetchRoutineExercisesByUserRoutine(userRoutineId, token)
                    : await fetchRoutineExercisesByRoutine(routine.routineId, token);

                const exercisesWithDetails = await Promise.all(
                    exercises.map(async (re) => {
                        const exerciseData = await fetchExerciseById(re.exerciseId, token);
                        return {
                            ...re,
                            name: exerciseData.name,
                            media: exerciseData.videoUrl,
                        };
                    })
                );

                if (!mounted) return;
                setRoutineExercises(exercisesWithDetails);
            } catch (err) {
                console.error(err);
                if (!mounted) return;
                setError("Error cargando datos");
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        }

        loadRoutineExercises();

        return () => { mounted = false; };
    }, [routine?.routineId, userRoutineId, token]);


    // sumar valores
    const totalSeries = routineExercises.reduce((acc, re) => acc + (re.sets || 0), 0);
    const totalReps = routineExercises.reduce((acc, re) => acc + ((re.reps || 0) * (re.sets || 0)), 0);
    const totalTimeRaw = routineExercises.reduce((acc, re) => acc + ((re.time || 0) * (re.sets || 0)), 0);


    useEffect(() => {
        if (!routine?.id) return;

        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 6);

        const startDate = lastWeek.toISOString().split("T")[0];

        fetchWeeklyProgress(routine.id, startDate, token)
            .then((data) => {
                // transformamos la data al formato del gráfico
                const formatted = transformToWeek(data);
                setWeeklyData(formatted);
            })
            .catch(err => console.error(err));
    }, [routine?.id, token]);

    return (
        <div className="flex w-full h-full">
            {/* LADO DERECHO */}
            <div className="bg-white p-6 flex flex-col gap-6 relative items-start" style={{ color: "var(--negro)" }}>
                <UserBadge userName={routine.userName} certified={routine.certified} />
                <h2 className="text-3xl font-bold">{routine?.name}</h2>

                {loading ? (
                    <p>Cargando resumen...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="flex flex-row gap-8 items-start">

                        {/* Solo mostrar si el tiempo total es mayor a 0 */}
                        {totalTimeRaw > 0 && (
                            <SummaryExercise
                                titulo={msToPretty(totalTimeRaw)}
                                subtitulo="Tiempo estimado"
                            />
                        )}

                        {/* Solo mostrar si hay series */}
                        {totalSeries > 0 && (
                            <SummaryExercise
                                titulo={totalSeries}
                                subtitulo="Series"
                            />
                        )}

                        {/* Solo mostrar si hay repeticiones */}
                        {totalReps > 0 && (
                            <SummaryExercise
                                titulo={totalReps}
                                subtitulo="Repeticiones"
                            />
                        )}
                    </div>
                )}
                <div className="w-full mt-6">
                    <WeeklyRoutineChart data={weeklyData.length > 0 ? weeklyData : [
                        { day: "Dom", count: 0 },
                        { day: "Lun", count: 0 },
                        { day: "Mar", count: 0 },
                        { day: "Mié", count: 0 },
                        { day: "Jue", count: 0 },
                        { day: "Vie", count: 0 },
                        { day: "Sáb", count: 0 }
                    ]} />
                </div>
                <div className="flex items-center gap-3 mt-8 mb-0 w-full">
                    {/* Span alineado a la izquierda */}
                    <span className="text-sm ml-5 mr-auto text-gray-400">
                    Ejercicios
                  </span>

                    {/* Botones alineados a la derecha */}
                    <IconTextButton
                        icon={Settings2}
                        text="Editar rutina"
                        onClick={onEdit}
                    />
                    <IconButton
                        icon={Trash2}
                        onClick={() => console.log("Eliminar rutina")}
                    />
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {routineExercises.map((re) => (
                        <ExerciseDetailCard
                            key={re.id}
                            exercise={{
                                name: re.name,
                                media: re.media ? [{ src: re.media }] : [],
                                details: [
                                    { sets: re.sets, reps: re.reps, time: re.time }
                                ]
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
