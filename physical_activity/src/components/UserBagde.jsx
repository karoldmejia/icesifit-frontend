import { User, UserCheck } from "lucide-react";

export default function UserBadge({ userName, certified }) {
    return (
        <div className="flex items-center gap-2 top-2 left-2">

            {/* Icono dentro del botón cuadrado */}
            <button
                className={`w-7 h-7 rounded-md flex items-center justify-center 
                    ${certified ? 'bg-green-500' : 'bg-gray-700'}`}
            >
                {certified ? (
                    <UserCheck className="w-4 h-4 text-white" />
                ) : (
                    <User className="w-4 h-4 text-white" />
                )}
            </button>

            {/* Texto al lado */}
            <span className="text-sm font-medium" style={{ color: "var(--grafito)" }}>
                Creado por {userName || "usuario"}
            </span>

        </div>
    );
}
