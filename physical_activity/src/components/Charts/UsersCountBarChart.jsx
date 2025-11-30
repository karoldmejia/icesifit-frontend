import { useState, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import MetricSelect from "@/components/MetricSelect.jsx";

export default function UsersCountBarChart({ data }) {
    // data: [{ date: "2025-11-28", userCount: 3 }, ...]

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return null;

        const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7 = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);

            const label = d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

            const found = sorted.find(item => {
                const itemD = new Date(item.date);
                itemD.setHours(0, 0, 0, 0);
                return itemD.getTime() === d.getTime();
            });

            last7.push({
                day: label,
                userCount: found?.userCount ?? 0
            });
        }

        return last7;
    }, [data]);

    const metrics = [
        { key: "userCount", label: "Usuarios activos" }
    ];
    const [metric, setMetric] = useState("userCount");


    return (

        <div className="w-full h-72 bg-transparent rounded-lg flex flex-col gap-2 overflow-visible">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm mr-auto text-gray-400">Usuarios activos últimos 7 días</span>
                <MetricSelect metrics={metrics} metric={metric} setMetric={setMetric} />
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis allowDecimals={false} width={20} />
                    <Tooltip />
                    <Bar dataKey={metric} fill="#4B5563" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
