const IconButton = ({
                        icon: Icon,
                        onClick,
                        size = "w-8 h-8",
                        color = "bg-white",
                        textColor = "text-gray-700",
                        className
                    }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center ${size} ${color} ${textColor} rounded-full hover:brightness-95 transition ${className}`}
        >
            {Icon && <Icon className="w-4 h-4" />}
        </button>
    );
};

export default IconButton;
