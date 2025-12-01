import React from "react";
import PropTypes from "prop-types";
export default function SummaryExercise({ titulo, subtitulo }) {
    return (
        <div className="flex flex-col leading-tight w-fit">
            <p className="text-lg font-medium" style={{ color: "var(--grafito)" }}>
                {titulo}
            </p>
            <p className="text-sm" style={{ color: "var(--grafito)" }}>
                {subtitulo}
            </p>
        </div>
    );
}
SummaryExercise.propTypes = {
    titulo: PropTypes.string.isRequired,
    subtitulo: PropTypes.string.isRequired,
};