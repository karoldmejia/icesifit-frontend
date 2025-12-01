import React from 'react';

const EventCard = ({ event, onView }) => {
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCardClick = () => {
        if (onView) {
            onView(event);
        }
    };

    return (
        <article
            className="mx-auto w-full max-w-[300px] bg-[#363636] rounded-xl p-2 text-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-[#404040]"
            onClick={handleCardClick}
        >
            <section className="bg-gray-400 rounded-t-lg p-6">
                <header className="flex justify-between items-center gap-4">
                    <span className="font-bold text-sm">
                        {event.capacity || 0} personas
                    </span>
                </header>

                <h3 className="my-8 text-2xl font-semibold pr-8 line-clamp-2">
                    {event.name}
                </h3>

                <div className="space-y-1 text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Inicio:</span>
                        <span>{formatDate(event.startDate)}  -</span>
                        <span>{formatTime(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Fin:</span>
                        <span>{formatDate(event.endDate)}  -</span>
                        <span>{formatTime(event.endDate)}</span>
                    </div>
                </div>
            </section>

            <footer className="flex flex-col items-start p-3 gap-4 font-bold text-sm">
                <div className="flex items-center gap-3 w-full">
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-300 truncate">
                            {event.type || 'Evento'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {event.description || 'Sin descripción'}
                        </p>
                    </div>
                </div>
            </footer>
        </article>
    );
};

export default EventCard;