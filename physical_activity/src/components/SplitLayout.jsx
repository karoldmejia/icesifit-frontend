import { motion, AnimatePresence } from "framer-motion";

export default function SplitLayout({ left, right, showLeft }) {
    return (
        <div className="flex w-full h-full">
            {/* LADO IZQUIERDO */}
            <AnimatePresence>
                {showLeft && (
                    <motion.div
                        className="w-2/6 bg-gray-100 p-4 rounded-l-lg"
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {left}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LADO DERECHO */}
            <div
                className={`p-6 flex flex-col gap-6 relative items-start bg-white transition-all duration-500`}
                style={{ width: showLeft ? "66.666%" : "100%" }}
            >
                {right}
            </div>
        </div>
    );
}
