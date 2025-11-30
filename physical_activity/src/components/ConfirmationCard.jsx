import { X } from "lucide-react";

export default function ConfirmationCard({ title, description, onDeactivate, onCancel }) {
    return (
        <div className="overflow-hidden relative bg-[#232531] text-left rounded-lg max-w-xs shadow-lg">
            <div className="p-4 flex flex-col items-center">

                {/* Icono */}
                <div className="flex justify-center items-center w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl">
                    <X className="w-6 h-6 text-[#d65563]" />
                </div>

                {/* Contenido */}
                <div className="mt-3 text-center">
                    <span className="text-white font-medium text-base">{title}</span>
                    <p className="mt-1 text-gray-500 text-sm">{description}</p>
                </div>

                {/* Acciones */}
                <div className="mt-3 w-full flex flex-col gap-2">
                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-[#d65563] text-white font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors"
                        onClick={onDeactivate}
                    >
                        Eliminar
                    </button>
                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-white/5 text-white font-medium rounded-md border border-white/10 shadow-sm hover:bg-white/10 transition-colors"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
