import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import WeeklyRoutineChartWithFilters from "@/components/Charts/WeeklyRoutineChartWithFilters";
import { fetchProgressByRoutineExercise } from "@/services/progressServices";
import {ProgressItem} from "@/components/ProgressItem.jsx";
import IconButton from "@/components/IconButton.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ExerciseDetails({ exercise, onBack }) {
    const token = useSelector(state => state.user.token);
    const [progressData, setProgressData] = useState([]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const filteredProgress = progressData.filter(p => {
        const date = new Date(p.rawDate);
        const afterStart = startDate ? date >= new Date(startDate) : true;
        const beforeEnd = endDate ? date <= new Date(endDate) : true;
        return afterStart && beforeEnd;
    });

    useEffect(() => {
        async function loadProgress() {
            try {
                const progress = await fetchProgressByRoutineExercise(exercise.id, token);

                const formatted = progress.map(p => ({
                    rawDate: p.progressDate,
                    day: new Date(p.progressDate).toLocaleDateString("es-CO",{ day:"numeric", month:"short" }),
                       count: p.setsCompleted,
                       setsCompleted: p.setsCompleted,
                       repsCompleted: p.repsCompleted || 0,
                        timeCompleted: p.timeCompleted || 0
            }));


                setProgressData(formatted);
            } catch(err) {
                console.error("Error cargando progreso ejercicio:", err);
            }
        }
        loadProgress();
    }, [exercise, token]);

    return (
        <div className="p-2 h-full flex flex-col gap-4">

            {/* Imagen con botón sobrepuesto */}
            {exercise.media && (
                <div className="relative w-full h-48 mt-2">
                    <img
                        src={exercise.media}
                        className="w-full h-full rounded-lg object-cover"
                    />

                    <div className="absolute top-2 left-2">
                        <IconButton
                            icon={ArrowLeft}
                            onClick={onBack}
                            size="w-8 h-8"
                            className="shadow"
                        />
                    </div>
                </div>
            )}

            <h2 className="text-xl text-gray-900 font-medium">{exercise.name}</h2>

            {progressData.length > 0 ? (
                              <WeeklyRoutineChartWithFilters data={progressData}/>
            ) : (
                <p className="text-gray-500 text-sm mt-4">
                    No hay registro de progreso todavía
                </p>
            )}
            {progressData.length > 0 && (
                <div className="mt-4 w-full">

                    {/* Título + filtros */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm mr-auto text-gray-400">
                            Historial
                        </span>
                        <div className="flex gap-2 items-center">

                            <input
                                type="date"
                                className="bg-gray-100 text-xs px-2 py-1 text-gray-800 rounded"
                                value={startDate || ""}
                                onChange={e => setStartDate(e.target.value)}
                            />

                            <ArrowRight className="w-4 h-4 text-gray-800" />

                            <input
                                type="date"
                                className="bg-gray-100 text-xs px-2 py-1 text-gray-800 rounded"
                                value={endDate || ""}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Lista filtrada */}
                    <div className="rounded-md overflow-hidden">
                        {filteredProgress.length > 0 ? (
                            filteredProgress.map((p, i) => (
                                <ProgressItem
                                    key={i}
                                    media={exercise.media}
                                    date={new Date(p.rawDate).toLocaleDateString("es-CO", {
                                        day:"numeric", month:"short", year:"2-digit"
                                    })}
                                    sets={p.setsCompleted}
                                    reps={p.repsCompleted}
                                    time={p.timeCompleted}
                                />
                            ))
                        ) : (
                            <p className="text-xs text-gray-500 p-3 text-center">
                                Sin registros en este rango de fechas
                            </p>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
