import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder }) {
    return (
        <div className="group relative max-w-[400px]">
            {/* Contenedor con escala al presionar */}
            <div className="relative transition-transform duration-150 active:scale-95">
                {/* Ícono */}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />

                {/* Input */}
                <input
                    type="search"
                    name="searchbar"
                    id="query"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder || "Buscar..."}
                    className="w-96 h-11 pl-10 pr-3 rounded-lg bg-transparent text-gray-300 placeholder-gray-400 outline-none
                     shadow-[0_0_0_1.5px_#2b2c37,0_0_25px_-17px_#000] transition-all duration-200
                     hover:shadow-[0_0_0_2.5px_#2f303d,0_0_25px_-15px_#000] focus:shadow-[0_0_0_2.5px_#2f303d]"

                />
            </div>
        </div>
    );
}
