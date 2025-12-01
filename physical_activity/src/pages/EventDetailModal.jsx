import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Calendar, Clock, Users, FileText, Plus, Save, X, Trash2, MapPin, UserPlus, UserMinus, User } from "lucide-react";
import { fetchEventSchedulesByEvent, createEventSchedule, deleteEventSchedule } from "@/services/eventScheduleServices";
import { fetchSchedules } from "@/services/scheduleServices";
import { deleteEvent } from "@/services/eventServices";
import { fetchSpaces } from "@/services/spaceServices";
import { fetchUserEventsByEvent, registerUserToEvent, cancelRegistration } from "@/services/userEventServices";
import IconTextButton from "@/components/IconTextButton.jsx";
import IconButton from "@/components/IconButton.jsx";
import Modal from "@/components/Modal.jsx";
import NotificationAlert from "@/components/NotificationAlert.jsx";
import ConfirmationCard from "@/components/ConfirmationCard.jsx";

const EventDetailModal = ({ isOpen, onClose, event, onEventDeleted }) => {
    const token = useSelector(state => state.user.token);
    const userRole = useSelector(state => state.user.role);
    const currentUserId = useSelector(state => state.user.id);

    const [eventSchedules, setEventSchedules] = useState([]);
    const [availableSchedules, setAvailableSchedules] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [spacesLoading, setSpacesLoading] = useState(false);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ type: "", description: "", show: false });
    const [eventScheduleToDelete, setEventScheduleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isDeletingEvent, setIsDeletingEvent] = useState(false);

    // Estados para participantes
    const [participants, setParticipants] = useState([]);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [userRegistrationId, setUserRegistrationId] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [unregistering, setUnregistering] = useState(false);

    // Mapa para relacionar scheduleId con space
    const [scheduleSpaceMap, setScheduleSpaceMap] = useState({});

    // Estado del formulario
    const [formData, setFormData] = useState({
        scheduleId: ''
    });

    useEffect(() => {
        if (isOpen && event) {
            loadEventSchedules();
            loadAvailableSchedules();
            loadSpaces();
            loadParticipants();
            // Resetear el formulario cuando se abre el modal
            setShowAddForm(false);
            setShowParticipants(false);
            setFormData({
                scheduleId: ''
            });
        }
    }, [isOpen, event]);

    const loadEventSchedules = async () => {
        try {
            setLoading(true);
            const eventSchedulesData = await fetchEventSchedulesByEvent(event.id, token);
            setEventSchedules(eventSchedulesData);
        } catch (err) {
            console.error("Error cargando horarios del evento:", err);
            setError("Error al cargar los horarios del evento");
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableSchedules = async () => {
        try {
            const schedulesData = await fetchSchedules(token);
            setAvailableSchedules(schedulesData);

            // Crear un mapa de scheduleId a spaceId para referencia rápida
            const scheduleSpaceMap = {};
            schedulesData.forEach(schedule => {
                if (schedule.spaceId) {
                    scheduleSpaceMap[schedule.id] = schedule.spaceId;
                }
            });
            setScheduleSpaceMap(scheduleSpaceMap);
        } catch (err) {
            console.error("Error cargando horarios disponibles:", err);
        }
    };

    const loadSpaces = async () => {
        try {
            setSpacesLoading(true);
            const spacesData = await fetchSpaces(token);
            setSpaces(spacesData);
        } catch (err) {
            console.error("Error cargando espacios:", err);
        } finally {
            setSpacesLoading(false);
        }
    };

    const loadParticipants = async () => {
        try {
            setParticipantsLoading(true);
            const participantsData = await fetchUserEventsByEvent(event.id, token);
            setParticipants(participantsData);

            // Verificar si el usuario actual está registrado
            const userRegistration = participantsData.find(p => p.userId === currentUserId);
            if (userRegistration) {
                setIsUserRegistered(true);
                setUserRegistrationId(userRegistration.id);
            } else {
                setIsUserRegistered(false);
                setUserRegistrationId(null);
            }
        } catch (err) {
            console.error("Error cargando participantes:", err);
        } finally {
            setParticipantsLoading(false);
        }
    };

    // Función para obtener el nombre del espacio basado en scheduleId
    const getSpaceNameForSchedule = (scheduleId) => {
        const spaceId = scheduleSpaceMap[scheduleId];
        if (spaceId) {
            const space = spaces.find(s => s.id === spaceId);
            return space ? space.name : `Espacio #${spaceId}`;
        }
        return "Sin espacio asignado";
    };

    // Función para obtener el espacio completo basado en scheduleId
    const getSpaceForSchedule = (scheduleId) => {
        const spaceId = scheduleSpaceMap[scheduleId];
        if (spaceId) {
            return spaces.find(s => s.id === spaceId);
        }
        return null;
    };

    const formatTimeFromDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDayName = (dayOfWeek) => {
        const days = {
            'MONDAY': 'Lunes',
            'TUESDAY': 'Martes',
            'WEDNESDAY': 'Miércoles',
            'THURSDAY': 'Jueves',
            'FRIDAY': 'Viernes',
            'SATURDAY': 'Sábado',
            'SUNDAY': 'Domingo'
        };
        return days[dayOfWeek] || dayOfWeek;
    };

    // Función para obtener el día de la semana de un schedule
    const getDayForSchedule = (scheduleId) => {
        const schedule = availableSchedules.find(s => s.id === scheduleId);
        return schedule ? schedule.dayOfWeek : 'UNKNOWN';
    };

    const handleAddEventSchedule = () => {
        setShowAddForm(true);
        setShowParticipants(false);
    };

    const handleToggleParticipants = () => {
        setShowParticipants(!showParticipants);
        setShowAddForm(false);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setFormData({
            scheduleId: ''
        });
    };

    const handleSubmitEventSchedule = async (e) => {
        e.preventDefault();

        if (!event?.id || !formData.scheduleId) return;

        try {
            setIsSubmitting(true);

            await createEventSchedule(event.id, formData.scheduleId, token);

            // Mostrar notificación de éxito
            setAlert({
                type: "success",
                description: "Horario asignado al evento correctamente",
                show: true
            });

            // Recargar horarios del evento
            await loadEventSchedules();

            // Cerrar formulario y resetear
            setShowAddForm(false);
            setFormData({
                scheduleId: ''
            });

        } catch (err) {
            console.error("Error asignando horario al evento:", err);
            setAlert({
                type: "error",
                description: "Error al asignar el horario al evento",
                show: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterToEvent = async () => {
        try {
            setRegistering(true);

            await registerUserToEvent(currentUserId, event.id, token);

            setAlert({
                type: "success",
                description: "Te has registrado al evento correctamente",
                show: true
            });

            // Recargar participantes
            await loadParticipants();

        } catch (err) {
            console.error("Error registrándose al evento:", err);
            setAlert({
                type: "error",
                description: "Error al registrarse al evento",
                show: true
            });
        } finally {
            setRegistering(false);
        }
    };

    const handleUnregisterFromEvent = async () => {
        if (!userRegistrationId) return;

        try {
            setUnregistering(true);

            await cancelRegistration(userRegistrationId, token);

            setAlert({
                type: "success",
                description: "Te has desregistrado del evento correctamente",
                show: true
            });

            // Recargar participantes
            await loadParticipants();

        } catch (err) {
            console.error("Error desregistrándose del evento:", err);
            setAlert({
                type: "error",
                description: "Error al desregistrarse del evento",
                show: true
            });
        } finally {
            setUnregistering(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteEventSchedule = (eventSchedule) => {
        setEventScheduleToDelete(eventSchedule);
    };

    const handleConfirmDelete = async () => {
        if (!eventScheduleToDelete) return;

        try {
            setIsDeleting(true);
            await deleteEventSchedule(eventScheduleToDelete.id, token);

            // Mostrar notificación de éxito
            setAlert({
                type: "success",
                description: "Horario desasignado del evento correctamente",
                show: true
            });

            // Recargar horarios del evento
            await loadEventSchedules();

            // Cerrar modal de confirmación
            setEventScheduleToDelete(null);

        } catch (err) {
            console.error("Error eliminando horario del evento:", err);
            setAlert({
                type: "error",
                description: "Error al desasignar el horario del evento",
                show: true
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setEventScheduleToDelete(null);
    };

    const handleDeleteEvent = () => {
        setEventToDelete(event);
    };

    const handleConfirmEventDelete = async () => {
        if (!eventToDelete) return;

        try {
            setIsDeletingEvent(true);
            await deleteEvent(eventToDelete.id, token);

            // Mostrar notificación de éxito
            setAlert({
                type: "success",
                description: "Evento eliminado correctamente",
                show: true
            });

            // Cerrar todos los modales
            setEventToDelete(null);
            onClose();

            // Notificar al componente padre que el evento fue eliminado
            if (onEventDeleted) {
                onEventDeleted(eventToDelete.id);
            }

        } catch (err) {
            console.error("Error eliminando evento:", err);
            setAlert({
                type: "error",
                description: "Error al eliminar el evento",
                show: true
            });
        } finally {
            setIsDeletingEvent(false);
        }
    };

    const handleCancelEventDelete = () => {
        setEventToDelete(null);
    };

    // Filtrar horarios que ya están asignados a este evento
    const getAvailableSchedulesOptions = () => {
        const assignedScheduleIds = eventSchedules.map(es => es.scheduleId);
        return availableSchedules.filter(schedule =>
            !assignedScheduleIds.includes(schedule.id)
        );
    };

    if (!event) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} bgColor={"#323132"}>
                <div className="p-6">
                    {/* Header del evento con botón de eliminar */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-medium text-gray-200">{event.name}</h2>
                            {userRole === "ROLE_Admin" && (
                            <IconButton
                                icon={Trash2}
                                onClick={handleDeleteEvent}
                                className="text-gray-200 hover:text-red-700 hover:bg-red-50"
                                color={"bg-gray-600"}
                                textColor={"text-gray-200"}
                            />
                                )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Calendar size={18} className="text-gray-400" />
                                <span>
                                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-400">
                                <Clock size={18} className="text-gray-400" />
                                <span>
                                    {formatTimeFromDate(event.startDate)} - {formatTimeFromDate(event.endDate)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-400">
                                <Users size={18} className="text-gray-400" />
                                <span>Capacidad: {event.capacity || 0} personas</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-400">
                                <Users size={18} className="text-gray-400" />
                                <span>Inscritos: {participants.length} personas</span>
                            </div>

                            {event.type && (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <FileText size={18} className="text-gray-400" />
                                    <span>Tipo: {event.type}</span>
                                </div>
                            )}

                            {event.description && (
                                <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-300 text-sm">{event.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-600 my-6"></div>

                    {/* Sección de horarios asignados */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-medium text-gray-300">Horarios asignados</h3>
                        <div className="flex gap-2">
                            {/* Botón para ver participantes */}
                            {userRole !== "ROLE_Admin" && (
                                <div>
                                    {!isUserRegistered ? (
                                        <IconButton
                                            icon={UserPlus}
                                            onClick={handleRegisterToEvent}
                                            disabled={registering || participants.length >= event.capacity}
                                            className="text-gray-200 hover:text-green-700 hover:bg-green-50"
                                            color={"bg-gray-600"}
                                            textColor={"text-gray-200"}
                                        />
                                    ) : (
                                        <IconButton
                                            icon={UserMinus}
                                            onClick={handleUnregisterFromEvent}
                                            disabled={unregistering}
                                            className="text-gray-200 hover:text-red-700 hover:bg-red-50"
                                            color={"bg-gray-600"}
                                            textColor={"text-gray-200"}
                                        />
                                    )}
                                </div>
                            )}
                            <IconButton
                                icon={User}
                                onClick={handleToggleParticipants}
                                className={`text-gray-200 ${showParticipants ? 'bg-gray-700' : 'hover:bg-gray-50'}`}
                                color={"bg-gray-600"}
                                textColor={"text-gray-200"}
                            />
                            {userRole === "ROLE_Admin" && !showAddForm && getAvailableSchedulesOptions().length > 0 && (
                                <IconTextButton
                                    icon={Plus}
                                    text="Asignar horario"
                                    onClick={handleAddEventSchedule}
                                    textColor="text-gray-200"
                                    className="hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                    color={"bg-gray-600"}
                                />
                        )}
                        </div>
                    </div>

                    {/* Botones de registro/desregistro (solo para no admins) */}

                    {/* Dropdown de participantes */}
                    {showParticipants && (
                        <div className="mb-6 border-2 border-dashed border-gray-700 rounded-lg bg-[#363636] overflow-hidden">
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-base font-semibold text-gray-300">Participantes del evento</h4>
                                    <span className="text-sm text-gray-400">
                                        {participants.length} de {event.capacity || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto">
                                {participantsLoading ? (
                                    <div className="p-4 text-center">
                                        <p className="text-gray-500">Cargando participantes...</p>
                                    </div>
                                ) : participants.length === 0 ? (
                                    <div className="p-4 text-center">
                                        <p className="text-gray-400">No hay participantes registrados</p>
                                    </div>
                                ) : (
                                    <div className="space-y-0">
                                        {participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-gray-600 text-sm font-medium">
                                                            {participant.userName ? participant.userName.charAt(0).toUpperCase() : 'U'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-gray-200 truncate">
                                                            {participant.userName || 'Usuario sin nombre'}
                                                        </h3>
                                                        <p className="text-xs text-gray-400">
                                                            Registrado: {formatDateTime(participant.registrationDate)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Formulario para asignar horario */}
                    {showAddForm && (
                        <div className="mb-6 p-4 border-2 border-dashed border-gray-700 rounded-lg bg-[#363636]">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-semibold text-gray-300">Asignar horario al evento</h4>
                                <button
                                    onClick={handleCancelAdd}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitEventSchedule} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Seleccionar horario disponible
                                    </label>
                                    <select
                                        name="scheduleId"
                                        value={formData.scheduleId}
                                        onChange={handleInputChange}
                                        className="w-full p-2 bg-[#363636] border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-200 custom-select"
                                        required
                                        style={{
                                            backgroundColor: '#363636',
                                            color: '#e5e7eb'
                                        }}
                                    >
                                        <option value="" className="bg-[#363636] text-gray-200">Selecciona un horario</option>
                                        {getAvailableSchedulesOptions().map(schedule => {
                                            const spaceName = getSpaceNameForSchedule(schedule.id);
                                            return (
                                                <option
                                                    key={schedule.id}
                                                    value={schedule.id}
                                                    className="bg-[#363636] text-gray-200 hover:bg-[#404040]"
                                                >
                                                    {getDayName(schedule.dayOfWeek)} - {formatTimeFromDate(schedule.startTime)} a {formatTimeFromDate(schedule.endTime)} - {spaceName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelAdd}
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {isSubmitting ? 'Asignando...' : 'Asignar horario'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lista de horarios asignados */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Cargando horarios...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : eventSchedules.length === 0 && !showAddForm ? (
                        <div className="text-center py-8 bg-transparent rounded-lg">
                            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-400">No hay horarios asignados a este evento</p>
                            <p className="text-gray-500 text-sm mt-1">
                                {getAvailableSchedulesOptions().length > 0
                                    ? "Asigna horarios para programar el evento"
                                    : "No hay horarios disponibles para asignar"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96">
                            {eventSchedules.map((eventSchedule) => {
                                const dayOfWeek = getDayForSchedule(eventSchedule.scheduleId);
                                const space = getSpaceForSchedule(eventSchedule.scheduleId);
                                const spaceName = getSpaceNameForSchedule(eventSchedule.scheduleId);

                                return (
                                    <div
                                        key={eventSchedule.id}
                                        className="p-4 border border-gray-700 rounded-lg bg-[#363636] hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Calendar size={16} className="text-gray-300" />
                                                    <span className="font-medium text-gray-300">
                                                        {getDayName(dayOfWeek)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <Clock size={16} className="text-gray-400" />
                                                    <span>
                                                        {formatTimeFromDate(eventSchedule.scheduleStartTime)} - {formatTimeFromDate(eventSchedule.scheduleEndTime)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-gray-400 mt-1">
                                                    <MapPin size={16} className="text-gray-400" />
                                                    <span>Espacio: {spaceName}</span>
                                                </div>

                                                {space && space.location && (
                                                    <div className="flex items-center gap-3 text-gray-500 mt-1 ml-7">
                                                        <span className="text-xs">Ubicación: {space.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botón de eliminar */}
                                            {userRole === "ROLE_Admin" && (
                                            <div className="flex items-center gap-2">
                                                <IconButton
                                                    icon={Trash2}
                                                    onClick={() => handleDeleteEventSchedule(eventSchedule)}
                                                    className="text-gray-200 hover:text-red-700 hover:bg-red-50"
                                                    color={"bg-gray-500"}
                                                    textColor={"text-gray-100"}
                                                />
                                            </div>
                                                )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal de confirmación para eliminar horario del evento */}
            {eventScheduleToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <ConfirmationCard
                        title="¿Desasignar horario?"
                        description={`¿Estás seguro de que quieres desasignar este horario del evento? Esta acción no elimina el horario del sistema, solo lo desvincula del evento.`}
                        onDeactivate={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        loading={isDeleting}
                    />
                </div>
            )}

            {/* Modal de confirmación para eliminar evento */}
            {eventToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <ConfirmationCard
                        title="¿Eliminar evento?"
                        description={`¿Estás seguro de que quieres eliminar el evento "${eventToDelete.name}"? Esta acción también eliminará todos los horarios asignados y no se puede deshacer.`}
                        onDeactivate={handleConfirmEventDelete}
                        onCancel={handleCancelEventDelete}
                        loading={isDeletingEvent}
                    />
                </div>
            )}

            {/* Notificación */}
            {alert.show && (
                <NotificationAlert
                    type={alert.type}
                    description={alert.description}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}

            {/* Estilos para personalizar el dropdown */}
            <style jsx>{`
                .custom-select option {
                    background-color: #363636;
                    color: #e5e7eb;
                }
                .custom-select option:hover {
                    background-color: #404040 !important;
                }
            `}</style>
        </>
    );
};

export default EventDetailModal;