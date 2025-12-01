// En Spaces.jsx
import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SpaceLayout from "./SpaceLayout";
import SpaceDetailModal from "./SpaceDetailModal";
import EventDetailModal from "./EventDetailModal";
import CreateSpaceModal from "@/pages/CreateSpaceModal.jsx";
import CreateEventModal from "@/pages/CreateEventModal.jsx";  // Importar el nuevo modal
import { fetchSpaces } from "@/services/spaceServices";
import { fetchEvents } from "@/services/eventServices";
import NotificationAlert from "@/components/NotificationAlert.jsx";

export default function Spaces() {
    const token = useSelector(state => state.user.token);
    const [spaces, setSpaces] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
    const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);
    const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);  // Nuevo estado
    const [alert, setAlert] = useState({ type: "", description: "", show: false });

    // Cargar espacios y eventos al montar el componente
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setEventsLoading(true);

                const [spacesData, eventsData] = await Promise.all([
                    fetchSpaces(token),
                    fetchEvents(token)
                ]);

                setSpaces(spacesData);
                setEvents(eventsData);
            } catch (err) {
                console.error("Error cargando datos:", err);
                setError("Error al cargar los datos");
                showAlert("error", "Error al cargar los datos");
            } finally {
                setLoading(false);
                setEventsLoading(false);
            }
        }

        loadData();
    }, [token]);

    // Función auxiliar para mostrar alertas
    const showAlert = (type, description) => {
        setAlert({
            type,
            description,
            show: true
        });
    };

    // Handlers para espacios
    const handleMoreInfo = (space) => {
        setSelectedSpace(space);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedSpace(null);
    };

    const handleOpenCreateSpaceModal = () => {
        setIsCreateSpaceModalOpen(true);
    };

    const handleCloseCreateSpaceModal = () => {
        setIsCreateSpaceModalOpen(false);
    };

    const handleSpaceCreated = (newSpace) => {
        setSpaces(prev => [newSpace, ...prev]);
        showAlert("success", "Espacio creado correctamente");
        console.log("Nuevo espacio creado:", newSpace);
    };

    const handleSpaceDeleted = (deletedSpaceId) => {
        setSpaces(prev => prev.filter(space => space.id !== deletedSpaceId));
        showAlert("success", "Espacio eliminado correctamente");
        console.log(`Espacio ${deletedSpaceId} eliminado`);
    };

    // Handlers para eventos
    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setIsEventDetailModalOpen(true);
    };

    const handleCloseEventDetailModal = () => {
        setIsEventDetailModalOpen(false);
        setSelectedEvent(null);
    };

    const handleOpenCreateEventModal = () => {
        setIsCreateEventModalOpen(true);
    };

    const handleCloseCreateEventModal = () => {
        setIsCreateEventModalOpen(false);
    };

    const handleEventCreated = (newEvent) => {
        setEvents(prev => [newEvent, ...prev]);
        showAlert("success", "Evento creado correctamente");
        console.log("Nuevo evento creado:", newEvent);
    };

    const handleEventDeleted = (deletedEventId) => {
        setEvents(prev => prev.filter(event => event.id !== deletedEventId));
        showAlert("success", "Evento eliminado correctamente");
        console.log(`Evento ${deletedEventId} eliminado`);
    };

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <p className="text-gray-500">Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen p-6 pt-24">
            <SpaceLayout
                spaces={spaces}
                events={events}
                onMoreInfo={handleMoreInfo}
                onAddSpace={handleOpenCreateSpaceModal}
                onAddEvent={handleOpenCreateEventModal}  // Pasar el nuevo handler
                onViewEvent={handleViewEvent}
                showLeft={true}
            />

            {/* Modales de espacios */}
            <SpaceDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                space={selectedSpace}
                onSpaceDeleted={handleSpaceDeleted}
            />

            <CreateSpaceModal
                isOpen={isCreateSpaceModalOpen}
                onClose={handleCloseCreateSpaceModal}
                onSpaceCreated={handleSpaceCreated}
            />

            {/* Modales de eventos */}
            <EventDetailModal
                isOpen={isEventDetailModalOpen}
                onClose={handleCloseEventDetailModal}
                event={selectedEvent}
                onEventDeleted={handleEventDeleted}
            />

            <CreateEventModal  // Nuevo modal
                isOpen={isCreateEventModalOpen}
                onClose={handleCloseCreateEventModal}
                onEventCreated={handleEventCreated}
            />

            {/* Notificación global */}
            {alert.show && (
                <NotificationAlert
                    type={alert.type}
                    description={alert.description}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}
        </div>
    );
}