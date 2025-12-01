import React from "react";
import { useState, useMemo } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import MetricSelect from "@/components/MetricSelect.jsx";

export default function WeeklyRoutineChartWithFilters({ data }) {

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Crear un mapa de los datos por fecha para búsqueda rápida
        const dataMap = {};
        data.forEach(item => {
            // Usar rawDate que es lo que viene de tus datos
            dataMap[item.rawDate] = item;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            // Formatear la fecha como YYYY-MM-DD para comparar con rawDate
            const dateKey = d.toISOString().split('T')[0];

            const label = d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

            // Buscar en el mapa por la clave de fecha
            const found = dataMap[dateKey];

            last7.push({
                day: label,
                setsCompleted: found?.setsCompleted ?? 0,
                repsCompleted: found?.repsCompleted ?? 0,
                timeCompleted: found?.timeCompleted ?? 0,
                // Para debugging
                rawDate: dateKey,
                hasData: !!found
            });
        }

        console.log("Datos procesados para gráfico:", last7);
        return last7;
    }, [data]);

    const metrics = [
        { key: "setsCompleted", label: "Sets" },
        { key: "repsCompleted", label: "Reps" },
        { key: "timeCompleted", label: "Duración (min)" }
    ];

    const [metric, setMetric] = useState("setsCompleted");

    return (
        <div className="w-full h-72 bg-transparent rounded-lg flex flex-col gap-2 overflow-visible">

            <div className="flex items-center justify-between mb-2">
                <span className="text-sm mr-auto text-gray-400">
                    Actividad semanal
                </span>
                <MetricSelect metrics={metrics} metric={metric} setMetric={setMetric} />
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day"
                           tick={{ fontSize: 10 }}
                           interval={0} />
                    <YAxis allowDecimals={false}
                           width={20}/>
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey={metric}
                        stroke="#374151"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}