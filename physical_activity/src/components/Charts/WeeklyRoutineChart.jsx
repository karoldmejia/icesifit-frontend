import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function WeeklyRoutineChart({ data }) {
    console.log(data)
    return (
        <div className="w-full h-64 bg-transparent rounded-lg">
            <h3 className="text-base mb-3">Tu actividad en la última semana</h3>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}  // margen a la izquierda = 0

                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }} // tamaño de letra más pequeño
                        interval={0} // asegura que todos los ticks se muestren
                    />
                    <YAxis
                        allowDecimals={false}
                        width={10}
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#374151" // color de la línea
                        strokeWidth={3}
                        dot={{ r: 4 }} // tamaño de los puntos
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
