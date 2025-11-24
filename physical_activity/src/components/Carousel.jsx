import { useState, useEffect, useRef } from "react";

const Carousel = ({ items, interval = 3000, width = "w-full", height = "h-48" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    // Cambiar de slide automáticamente
    useEffect(() => {
        const nextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        };

        timeoutRef.current = setTimeout(nextSlide, interval);

        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, items.length, interval]);

    return (
        <div className={`relative overflow-hidden ${width} ${height}`}>
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, idx) => (
                    <div key={idx} className={`flex-shrink-0 ${width} ${height} flex justify-center items-center`}>
                        {item.type === "video" ? (
                            <video src={item.src} autoPlay muted loop className="w-full h-full object-cover" />
                        ) : (
                            <img src={item.src} alt="exercise" className="w-full h-full object-cover" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
