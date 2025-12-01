import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapPin, Users, Calendar, Clock, Plus, Save, X, Trash2 } from "lucide-react";
import { fetchSchedulesBySpace, createSchedule, deleteSchedule } from "@/services/scheduleServices";
import { deleteSpace } from "@/services/spaceServices";
import IconTextButton from "@/components/IconTextButton.jsx";
import IconButton from "@/components/IconButton.jsx";
import Modal from "@/components/Modal.jsx";
import NotificationAlert from "@/components/NotificationAlert.jsx";
import ConfirmationCard from "@/components/ConfirmationCard.jsx";

const SpaceDetailModal = ({ isOpen, onClose, space, onSpaceDeleted }) => {
    const token = useSelector(state => state.user.token);
    const userRole = useSelector(state => state.user.role);

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ type: "", description: "", show: false });
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [spaceToDelete, setSpaceToDelete] = useState(null);
    const [isDeletingSpace, setIsDeletingSpace] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '09:00',
        maxCapacity: '',
        available: true
    });

    useEffect(() => {
        if (isOpen && space) {
            loadSchedules();
            // Resetear el formulario cuando se abre el modal
            setShowAddForm(false);
            setFormData({
                dayOfWeek: 'MONDAY',
                startTime: '08:00',
                endTime: '09:00',
                maxCapacity: '',
                available: true
            });
        }
    }, [isOpen, space]);

    const loadSchedules = async () => {
        try {
            setLoading(true);
            const schedulesData = await fetchSchedulesBySpace(space.id, token);
            setSchedules(schedulesData);
        } catch (err) {
            console.error("Error cargando horarios:", err);
            setError("Error al cargar los horarios");
        } finally {
            setLoading(false);
        }
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

    // Función para formatear solo la hora de las fechas
    const formatTimeFromDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const handleAddSchedule = () => {
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setFormData({
            dayOfWeek: 'MONDAY',
            startTime: '08:00',
            endTime: '09:00',
            maxCapacity: '',
            available: true
        });
    };

    const handleSubmitSchedule = async (e) => {
        e.preventDefault();

        if (!space?.id) return;

        try {
            setIsSubmitting(true);

            // Función para crear una fecha con hora específica
            const createDateTime = (timeString) => {
                // Usar una fecha base (por ejemplo, 1970-01-01) y agregar la hora
                const [hours, minutes] = timeString.split(':');
                const date = new Date(1970, 0, 1, parseInt(hours), parseInt(minutes));
                return date.toISOString(); // Esto devuelve "1970-01-01T08:00:00.000Z"
            };

            // Preparar datos para enviar
            const scheduleData = {
                ...formData,
                startTime: createDateTime(formData.startTime),
                endTime: createDateTime(formData.endTime),
                maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null
            };

            console.log("Enviando datos:", scheduleData); // Para debug

            await createSchedule(space.id, scheduleData, token);

            // Mostrar notificación de éxito
            setAlert({
                type: "success",
                description: "Horario agregado correctamente",
                show: true
            });

            // Recargar horarios
            await loadSchedules();

            // Cerrar formulario y resetear
            setShowAddForm(false);
            setFormData({
                dayOfWeek: 'MONDAY',
                startTime: '08:00',
                endTime: '09:00',
                maxCapacity: '',
                available: true
            });

        } catch (err) {
            console.error("Error creando horario:", err);
            setAlert({
                type: "error",
                description: "Error al agregar el horario",
                show: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDeleteSchedule = (schedule) => {
        setScheduleToDelete(schedule);
    };

    const handleConfirmDelete = async () => {
        if (!scheduleToDelete) return;

        try {
            setIsDeleting(true);
            await deleteSchedule(scheduleToDelete.id, token);

            // Mostrar notificación de éxito
            setAlert({
                type: "success",
                description: "Horario eliminado correctamente",
                show: true
            });

            // Recargar horarios
            await loadSchedules();

            // Cerrar modal de confirmación
            setScheduleToDelete(null);

        } catch (err) {
            console.error("Error eliminando horario:", err);
            setAlert({
                type: "error",
                description: "Error al eliminar el horario",
                show: true
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setScheduleToDelete(null);
    };

    const handleDeleteSpace = () => {
        setSpaceToDelete(space);
    };

    const handleConfirmSpaceDelete = async () => {
        if (!spaceToDelete) return;

        try {
            setIsDeletingSpace(true);
            await deleteSpace(spaceToDelete.id, token);

            // Mostrar notificación de éxito
            setAlert({
                type: "success",
                description: "Espacio eliminado correctamente",
                show: true
            });

            // Cerrar todos los modales
            setSpaceToDelete(null);
            onClose();

            // Notificar al componente padre que el espacio fue eliminado
            if (onSpaceDeleted) {
                onSpaceDeleted(spaceToDelete.id);
            }

        } catch (err) {
            console.error("Error eliminando espacio:", err);
            setAlert({
                type: "error",
                description: "Error al eliminar el espacio",
                show: true
            });
        } finally {
            setIsDeletingSpace(false);
        }
    };

    const handleCancelSpaceDelete = () => {
        setSpaceToDelete(null);
    };

    if (!space) return null;

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} bgColor={"#323132"}>
                <div className="p-6">
                    {/* Header del espacio con botón de eliminar */}
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-medium text-gray-200">{space.name}</h2>
                            {userRole === "ROLE_Admin" && (
                                <IconButton
                                icon={Trash2}
                                onClick={handleDeleteSpace}
                                className="text-gray-200 hover:text-red-700 hover:bg-red-50 "
                                color={"bg-gray-600"}
                                textColor={"text-gray-200"}
                            />
                                )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-gray-400">
                                <MapPin size={18} className="text-gray-400" />
                                <span>{space.location || 'Sin ubicación específica'}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-400">
                                <Users size={18} className="text-gray-400" />
                                <span>Capacidad: {space.capacity || 0} personas</span>
                            </div>

                        </div>
                    </div>

                    {/* Separador */}
                    <div className="border-t border-gray-600 my-6"></div>

                    {/* Sección de horarios */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-medium text-gray-300">Horarios</h3>
                        {userRole === "ROLE_Admin" && !showAddForm && (
                            <IconTextButton
                                icon={Plus}
                                text="Agregar horario"
                                onClick={handleAddSchedule}
                                textColor="text-gray-200"
                                className="hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                color={"bg-gray-600"}
                            />
                        )}
                    </div>

                    {/* Formulario para agregar horario */}
                    {showAddForm && (
                        <div className="mb-6 p-4 border-2 border-dashed border-gray-700 rounded-lg bg-[#363636]">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-base font-semibold text-gray-300">Nuevo horario</h4>
                                <button
                                    onClick={handleCancelAdd}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitSchedule} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Día de la semana */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Día de la semana
                                        </label>
                                        <select
                                            name="dayOfWeek"
                                            value={formData.dayOfWeek}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-transparent border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="MONDAY">Lunes</option>
                                            <option value="TUESDAY">Martes</option>
                                            <option value="WEDNESDAY">Miércoles</option>
                                            <option value="THURSDAY">Jueves</option>
                                            <option value="FRIDAY">Viernes</option>
                                            <option value="SATURDAY">Sábado</option>
                                            <option value="SUNDAY">Domingo</option>
                                        </select>
                                    </div>

                                    {/* Hora de inicio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Hora de inicio
                                        </label>
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border bg-transparent border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Hora de fin */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Hora de fin
                                        </label>
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border bg-transparent border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Checkbox disponible */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-400">
                                        Horario disponible para reservas
                                    </label>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelAdd}
                                        className="px-4 py-2  text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {isSubmitting ? 'Guardando...' : 'Guardar horario'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lista de horarios existentes */}
                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Cargando horarios...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : schedules.length === 0 && !showAddForm ? (
                        <div className="text-center py-8 bg-transparent rounded-lg">
                            <Calendar size={48} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-400">No hay horarios configurados para este espacio</p>
                            <p className="text-gray-500 text-sm mt-1">Agrega horarios para que los usuarios puedan reservar</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {schedules.map((schedule) => (
                                <div
                                    key={schedule.id}
                                    className="p-4 border border-gray-700 rounded-lg bg-[#363636] hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Calendar size={16} className="text-gray-300" />
                                                <span className="font-medium text-gray-300">
                                                    {getDayName(schedule.dayOfWeek)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>
                                                    {formatTimeFromDate(schedule.startTime)} - {formatTimeFromDate(schedule.endTime)}
                                                </span>
                                            </div>

                                            {schedule.maxCapacity && (
                                                <div className="flex items-center gap-3 text-gray-600 mt-1">
                                                    <Users size={16} className="text-gray-400" />
                                                    <span>Capacidad máxima: {schedule.maxCapacity} personas</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Botón de eliminar */}
                                        {userRole === "ROLE_Admin" && (

                                            <div className="flex items-center gap-2">
                                            <IconButton
                                                icon={Trash2}
                                                onClick={() => handleDeleteSchedule(schedule)}
                                                className="text-gray-200 hover:text-red-700 hover:bg-red-50 "
                                                color={"bg-gray-500"}
                                                textColor={"text-gray-100"}                                            />
                                        </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Información adicional del espacio - MOSTRANDO SOLO HORAS */}
                    {(space.createdAt || space.updatedAt) && (
                        <>
                            <div className="border-t border-gray-200 my-6"></div>
                            <div className="text-xs text-gray-500">
                                {space.createdAt && (
                                    <p>Creado a las: {formatTimeFromDate(space.createdAt)}</p>
                                )}
                                {space.updatedAt && (
                                    <p>Actualizado a las: {formatTimeFromDate(space.updatedAt)}</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Modal de confirmación para eliminar horario */}
            {scheduleToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <ConfirmationCard
                        title="¿Eliminar horario?"
                        description={`¿Estás seguro de que quieres eliminar el horario del ${getDayName(scheduleToDelete.dayOfWeek)} (${formatTimeFromDate(scheduleToDelete.startTime)} - ${formatTimeFromDate(scheduleToDelete.endTime)})?`}
                        onDeactivate={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        loading={isDeleting}
                    />
                </div>
            )}

            {/* Modal de confirmación para eliminar espacio */}
            {spaceToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <ConfirmationCard
                        title="¿Eliminar espacio?"
                        description={`¿Estás seguro de que quieres eliminar el espacio "${spaceToDelete.name}"? Esta acción también eliminará todos los horarios asociados y no se puede deshacer.`}
                        onDeactivate={handleConfirmSpaceDelete}
                        onCancel={handleCancelSpaceDelete}
                        loading={isDeletingSpace}
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
        </>
    );
};

export default SpaceDetailModal;