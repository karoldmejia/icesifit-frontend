import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function MetricSelect({ metrics, metric, setMetric }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block text-white select-none">

            {/* Caja visible */}
            <div
                className="flex justify-between items-center bg-[#2a2f3b] px-3 py-2 rounded-md cursor-pointer min-w-[140px] text-sm"
                onClick={() => setOpen(!open)}
            >
                <span>
                    {metrics.find(m => m.key === metric)?.label}
                </span>

                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </div>

            {/* Opciones */}
            <div  className={`absolute left-0 w-full bg-[#2a2f3b] rounded-md mt-1 p-2 transition-all duration-300
                ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}
                z-[9999] shadow-xl`}
            >
                {metrics.map(m => (
                    <div key={m.key}>
                        <label
                            className="block cursor-pointer px-2 py-1 text-sm rounded hover:bg-[#323741]"
                            onClick={() => {
                                setMetric(m.key);
                                setOpen(false);
                            }}
                        >
                            {m.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
