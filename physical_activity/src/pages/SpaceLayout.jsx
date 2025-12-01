import React from "react";
import { Plus } from "lucide-react";
import SpaceCard from "@/components/SpaceCard.jsx";
import EventCard from "@/components/EventCard.jsx";
import IconTextButton from "@/components/IconTextButton.jsx";
import SplitLayout from "@/components/SplitLayout.jsx";
import {useSelector} from "react-redux";

const SpaceLayout = ({
                         spaces = [],
                         events = [],
                         onMoreInfo,
                         onAddEvent,
                         onAddSpace,
                         onViewEvent,
                         showLeft = true
                     }) => {
    const userRole = useSelector(state => state.user.role);

    return (
        <SplitLayout
            showLeft={showLeft}
            backgroundColor="bg-transparent"
            lineColor="bg-gray-700"
            left={
                <div className="space-y-4 flex-1 p-4">
                    {/* Botón agregar espacio */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-300">ESPACIOS</h2>
                        {userRole === "ROLE_Admin" && (
                        <IconTextButton
                            icon={Plus}
                            text="Agregar espacio"
                            onClick={onAddSpace}
                            textColor="text-gray-300"
                            className="hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors"
                            color={"bg-gray-600"}
                        />
                            )}
                    </div>

                    {/* Lista de espacios */}
                    <div className="space-y-4">
                        {spaces.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No hay espacios disponibles</p>
                            </div>
                        ) : (
                            spaces.map(space => (
                                <SpaceCard
                                    key={space.id}
                                    space={space}
                                    onMoreInfo={onMoreInfo}
                                />
                            ))
                        )}
                    </div>
                </div>
            }
            right={
                <div className="space-y-4 p-4">
                    {/* Header de eventos */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-gray-300">EVENTOS</h2>
                        {userRole === "ROLE_Admin" && (
                        <IconTextButton
                            icon={Plus}
                            text="Agregar evento"
                            onClick={onAddEvent}
                            textColor="text-gray-300"
                            className="hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-colors"
                            color={"bg-gray-600"}
                        />
                            )}
                    </div>

                    {/* Grid de eventos */}
                    {events.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-500 text-lg">
                                No hay eventos programados
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onView={onViewEvent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default SpaceLayout;