import React from "react";

import Carousel from "./Carousel.jsx";
import { User, Dumbbell } from "lucide-react";

const RoutineCard = ({ title, exercises, media, onClick}) => {
    const hasMedia = media && media.length > 0;

    return (
        <div onClick={onClick}>
            <div className="relative h-48 w-96 overflow-hidden rounded-xl bg-[#3d3c3d] drop-shadow-xl group">

                {/* Contenedor principal */}
                <div className="absolute inset-0.5 z-[1] flex flex-row rounded-lg bg-[#323132] p-4 text-white opacity-90">

                    {/* Carrusel o placeholder */}
                    <div className="flex-1 flex justify-center items-center relative rounded-lg overflow-hidden">
                        {hasMedia ? (
                            <Carousel items={media} height="h-40" />
                        ) : (
                            <div className="flex justify-center items-center w-full h-40 bg-gray-100 rounded-lg">
                                <Dumbbell className="w-10 h-10 text-gray-600" />
                            </div>
                        )}

                        {/* Botón cuadrado encima del carrusel */}
                        <button
                            className="absolute top-2 left-2 w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation(); // evita que se active el onClick del card
                                console.log("Botón presionado");
                            }}
                        >
                            <User className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Texto al lado derecho */}
                    <div className="flex-1 flex flex-col justify-center pl-4">
                        <p className="text-lg font-semibold leading-snug">{title}</p>
                        <div className="mt-2">
                            <p className="text-sm text-gray-300 line-clamp-2 overflow-hidden">
                                {exercises}
                            </p>
                        </div>
                    </div>

                    {/* Flechita en esquina inferior derecha */}
                    <svg
                        className="absolute bottom-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 duration-300 transition-all"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth={2}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fill="none" d="M0 0h24v24H0z" stroke="none" />
                        <path d="M5 12l14 0" />
                        <path d="M13 18l6 -6" />
                        <path d="M13 6l6 6" />
                    </svg>

                </div>

                {/* Fondo animado blur */}
                <div className="absolute transition-all duration-500 top-1/2 -left-1/2 group-hover:top-12 group-hover:-left-1/4 h-48 w-56 -z-10 bg-amber-800 blur-[50px]" />
            </div>
        </div>
    );
};

export default RoutineCard;
