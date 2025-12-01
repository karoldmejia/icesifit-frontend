import React from "react";
import PropTypes from "prop-types";

export default function Tabs({ tabs, activeTab, onTabChange, children }) {
    return (
        <div className="mt-10 w-full">
            {/* Navegación de pestañas */}
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base
                                ${activeTab === tab.id
                                ? 'border-white text-white'
                                : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
                            }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenido de las pestañas */}
            <div className="py-6">
                {children}
            </div>
        </div>
    );
}

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    children: PropTypes.node
};