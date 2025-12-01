import React from 'react';
import { MapPin, Users, ArrowRight } from 'lucide-react';

const SpaceCard = ({ space, onMoreInfo }) => {
    return (
        <div className="h-[170px] w-full bg-[#323132] mx-auto rounded-2xl overflow-hidden relative group p-4 z-0 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-800">
            {/* Círculo gris con efecto hover */}
            <div className="circle absolute h-20 w-20 -top-10 -right-10 rounded-full bg-gray-100 group-hover:scale-[1250%] duration-500 z-[-1] opacity-90 group-hover:opacity-100 transition-opacity"></div>

            {/* Botón More Info */}
            <button
                onClick={() => onMoreInfo(space)}
                className="text-sm absolute bottom-4 left-4 text-white group-hover:text-[#323132] duration-500 font-medium hover:scale-105 transition-transform focus:outline-none flex items-center gap-1"
            >
                <span className="relative before:h-0.5 before:absolute before:w-full before:content-[''] before:bg-white group-hover:before:bg-[#323132] duration-300 before:bottom-0 before:left-0 pb-1">
                    Más información
                </span>
                <ArrowRight size={14} className="flex-shrink-0" />
            </button>

            {/* Contenido principal */}
            <div className="z-20 relative">
                <h3 className="font-medium text-red group-hover:text-[#323132] duration-500 text-lg text-left mb-3 truncate">
                    {space.name}
                </h3>

                <div className="space-y-2 text-gray-300 group-hover:text-gray-700 duration-500">
                    <p className="text-sm flex items-center gap-2">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span className="truncate">{space.location || 'Sin ubicación'}</span>
                    </p>

                    <p className="text-sm flex items-center gap-2">
                        <Users size={16} className="flex-shrink-0" />
                        <span>Capacidad: {space.capacity || 0} personas</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SpaceCard;