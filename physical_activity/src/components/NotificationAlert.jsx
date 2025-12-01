import React from "react";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

export default function NotificationAlert({ type = "success", description, duration = 4000, onClose }) {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);

    const isSuccess = type === "success";

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => handleClose(), duration);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setAnimateOut(true);
        setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, 400);
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-5 right-5 z-50 flex flex-col gap-2
                        inline-flex max-w-xs min-w-[180px] text-[10px] sm:text-xs
                        transform transition-transform duration-400 ease-out
                        ${animateOut ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
        >
            <div className="cursor-default flex items-center justify-between rounded-lg bg-[#232531] px-3 py-2 whitespace-nowrap">

                {/* Icono + textos */}
                <div className="flex gap-2 items-center flex-1 min-w-0">
                    <div className={`${isSuccess ? "text-[#2b9875]" : "text-[#d65563]"} bg-white/5 backdrop-blur-xl p-1 rounded-lg`}>
                        {isSuccess ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div className="truncate">
                        <p className="text-white font-medium mb-1 truncate">
                            {isSuccess ? "Listo :)" : "Inténtalo nuevamente"}
                        </p>
                        <p className="text-gray-500 truncate">{description}</p>
                    </div>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:bg-white/10 p-1 ml-3 rounded-md transition-colors ease-linear"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
