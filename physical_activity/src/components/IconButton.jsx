const IconButton = ({ icon: Icon, onClick, size = "w-8 h-8", color = "bg-gray-100", className }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center ${size} ${color} rounded-full hover:brightness-90 transition ${className}`}
            style={{ color: "var(--grafito)" }}
        >
            {Icon && <Icon className="w-4 h-4" />}
        </button>
    );
};

export default IconButton;
