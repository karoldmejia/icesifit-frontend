import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UserBadge from "../components/UserBagde.jsx";
import SummaryExercise from "../components/SummaryExercise";
import {fetchWeeklyProgress, fetchWeeklyProgressByRoutine} from "../services/progressServices.js";
import {
    fetchRoutineExercisesByRoutine,
    fetchExerciseById,
    fetchRoutineExercisesByUserRoutine
} from "../services/routineExerciseServices";
import ExerciseDetailCard from "@/components/ExerciseDetailCard.jsx";
import IconTextButton from "@/components/IconTextButton.jsx";
import IconButton from "@/components/IconButton.jsx";
import { Settings2, Trash2 } from "lucide-react";
import {deleteUserRoutine} from "@/services/userRoutineServices.js";
import {deleteRoutine} from "@/services/routineServices.js";
import ConfirmationCard from "@/components/ConfirmationCard.jsx";
import WeeklyRoutineChartWithFilters from "@/components/Charts/WeeklyRoutineChartWithFilters.jsx";
import UsersCountBarChart from "@/components/Charts/UsersCountBarChart.jsx";
import { fetchUsersCountByRoutineDaily } from "../services/progressServices.js";


const msToPretty = (seconds) => {
    if (!seconds) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

export default function RoutineDetails({ routine, userRoutineId, onEdit, onDeleted }) {
    const token = useSelector(state => state.user.token);
    const [routineExercises, setRoutineExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weeklyData, setWeeklyData] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [usersCountData, setUsersCountData] = useState([]);
    const userRole = useSelector(state => state.user.role);

    useEffect(() => {
        if (!routine?.routineId) return;

        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 6);
        const startDate = lastWeek.toISOString().split("T")[0];

        fetchUsersCountByRoutineDaily(routine.routineId, token)
            .then(data => {
                // Filtramos solo últimos 7 días
                const filtered = data.filter(d => d.date >= startDate);
                setUsersCountData(filtered);
            })
            .catch(err => console.error("Error fetching users count:", err));
    }, [routine?.routineId, token]);


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
        const targetId = userRoutineId ?? routine?.routineId;

        if (!targetId) {
            console.warn("No se ejecuta fetchWeeklyProgress porque no hay ID disponible");
            return;
        }

        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 6);

        const startDate = lastWeek.toISOString().split("T")[0];
        // Se usa el targetId (prioridad al userRoutineId)
        fetchWeeklyProgressByRoutine(targetId, startDate, token)
            .then((data) => {
                const formatted = data.map(p => ({
                    rawDate: p.progressDate,
                    setsCompleted: p.setsCompleted,
                    repsCompleted: p.repsCompleted,
                    timeCompleted: p.timeCompleted
                }));

                const grouped = formatted.reduce((acc, curr) => {
                    const date = curr.rawDate;

                    if (!acc[date]) {
                        acc[date] = {
                            rawDate: date,
                            setsCompleted: 0,
                            repsCompleted: 0,
                            timeCompleted: 0
                        };
                    }

                    acc[date].setsCompleted += curr.setsCompleted || 0;
                    acc[date].repsCompleted += curr.repsCompleted || 0;
                    acc[date].timeCompleted += curr.timeCompleted || 0;

                    return acc;
                }, {});

                // Convertimos objeto → array antes de guardar
                setWeeklyData(Object.values(grouped));
            })
            .catch(err => console.error("Error al consultar progreso semanal:", err));

    }, [routine?.routineId, userRoutineId, token]);


    if (!usersCountData) {
        return (
            <div className="w-full h-72 flex items-center justify-center text-gray-400 text-sm">
                Ningún usuario ha implementado esta rutina.
            </div>
        );
    }

    const confirmDeleteRoutine = async () => {
        if (!routine?.routineId) return;

        setDeleting(true);

        try {
            // Si es una rutina de usuario, usar deleteUserRoutine
            if (userRoutineId) {
                await deleteUserRoutine(userRoutineId, token);
            } else {
                // Si es una rutina base, usar deleteRoutine
                await deleteRoutine(routine.routineId, token);
            }

            // Llamamos callback de padre para refrescar lista o manejar eliminación
            onDeleted?.();

            setShowConfirm(false);
        } catch (err) {
            console.error("Error eliminando rutina:", err);
        } finally {
            setDeleting(false);
        }
    };


    return (
        <div className="flex-1 w-full h-full">
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
                <div className="w-full h-full mt-6">
                    {userRoutineId ? (
                        // Si es una rutina de usuario, mostramos progreso semanal
                        (!weeklyData || weeklyData.length === 0) ? (
                            <div className="w-full h-72 flex items-center justify-center text-gray-400 text-sm">
                                No se ha registrado progreso en esta rutina
                            </div>
                        ) : (
                            <WeeklyRoutineChartWithFilters data={weeklyData} />
                        )
                    ) : (
                        // Si es una rutina base
                        (!usersCountData || usersCountData.length === 0) ? (
                            <div className="w-full h-72 flex items-center justify-center text-gray-400 text-sm">
                                Ningún usuario ha implementado esta rutina.
                            </div>
                        ) : (
                            <UsersCountBarChart data={usersCountData} />
                        )
                    )}
                </div>

                <div className="flex items-center gap-3 mt-8 mb-0 w-full">
                    {/* Span alineado a la izquierda */}
                    <span className="text-sm ml-5 mr-auto text-gray-400">
                        Ejercicios
                    </span>
                    {!(userRole === "ROLE_User" && routine.certified) && (
                        <>
                            <IconTextButton
                                icon={Settings2}
                                text="Editar rutina"
                                onClick={onEdit}
                            />
                            <IconButton
                                icon={Trash2}
                                onClick={() => setShowConfirm(true)}
                            />
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-4 w-full">
                    {routineExercises.length === 0 ? (
                            <p className="text-center text-gray-400 mt-4 text-sm">
                                No hay ejercicios en esta rutina
                            </p>
                    ) : (
                    routineExercises.map((re) => (
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
                    ))
                    )}
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <ConfirmationCard
                        title="¿Eliminar rutina?"
                        description="Esta acción no se puede deshacer."
                        onDeactivate={confirmDeleteRoutine}
                        onCancel={() => setShowConfirm(false)}
                    />

                </div>
            )}

        </div>
    );
}
