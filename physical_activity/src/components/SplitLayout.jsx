import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplitLayout({ left, right, showLeft, backgroundColor = "bg-white", lineColor = "bg-gray-200" }) {
    return (
        <div className="flex w-full h-full">
            {/* LADO IZQUIERDO */}
            <AnimatePresence>
                {showLeft && (
                    <motion.div
                        className="w-2/6 p-2 rounded-l-lg min-w-[320px]"
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {left}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`w-[1px] ml-5 ${lineColor}`} />

            {/* LADO DERECHO */}
            <div
                className={`p-6 flex-1 flex-col relative items-start ${backgroundColor} transition-all duration-500`}
            >
                {right}
            </div>
        </div>
    );
}