import React from "react";

const IconTextButton = ({
                            icon: Icon,
                            text,
                            onClick,
                            color = "bg-gray-100",
                            textColor = "text-[var(--grafito)]",
                            rounded = "rounded-lg",
                            size = "px-3 py-1",
                            gap = "gap-2",
                            className
                        }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center ${size} ${color} ${rounded} ${gap} ${className} hover:brightness-90 transition`}
        >
            {Icon && <Icon className={`w-4 h-4 ${textColor}`} />}
            {text && <span className={`text-sm ${textColor}`}>{text}</span>}
        </button>
    );
};

export default IconTextButton;