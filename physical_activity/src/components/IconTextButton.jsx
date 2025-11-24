const IconTextButton = ({
                            icon: Icon,
                            text,
                            onClick,
                            color = "bg-gray-100",
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
            {Icon && <Icon className="w-4 h-4" />}
            {text && <span className="text-sm" style={{ color: "var(--grafito)"}}>{text}</span>}
        </button>
    );
};

export default IconTextButton;