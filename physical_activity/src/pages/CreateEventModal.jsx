import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Calendar, Clock, Users, FileText, Save} from "lucide-react";
import { createEvent } from "@/services/eventServices";
import Modal from "@/components/Modal.jsx";
import NotificationAlert from "@/components/NotificationAlert.jsx";

const CreateEventModal = ({ isOpen, onClose, onEventCreated }) => {
    const token = useSelector(state => state.user.token);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ type: "", description: "", show: false });

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        capacity: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.name.trim()) {
            showAlert("error", "El nombre del evento es requerido");
            return;
        }

        if (!formData.startDate || !formData.startTime) {
            showAlert("error", "La fecha y hora de inicio son requeridas");
            return;
        }

        if (!formData.endDate || !formData.endTime) {
            showAlert("error", "La fecha y hora de fin son requeridas");
            return;
        }

        if (!formData.capacity || formData.capacity <= 0) {
            showAlert("error", "La capacidad debe ser un número mayor a 0");
            return;
        }

        try {
            setIsSubmitting(true);

            // Combinar fecha y hora
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

            // Validar que la fecha de fin sea después de la de inicio
            if (endDateTime <= startDateTime) {
                showAlert("error", "La fecha de fin debe ser posterior a la fecha de inicio");
                return;
            }

            // Preparar datos para enviar
            const eventData = {
                name: formData.name.trim(),
                type: formData.type.trim() || null,
                startDate: startDateTime.toISOString(),
                endDate: endDateTime.toISOString(),
                capacity: parseInt(formData.capacity),
                description: formData.description.trim() || null
            };

            const newEvent = await createEvent(eventData, token);

            // Mostrar notificación de éxito
            showAlert("success", "Evento creado correctamente");

            // Resetear formulario
            setFormData({
                name: '',
                type: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                capacity: '',
                description: ''
            });

            // Notificar al componente padre
            if (onEventCreated) {
                onEventCreated(newEvent);
            }

            // Cerrar modal después de un breve delay para que se vea la notificación
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err) {
            console.error("Error creando evento:", err);
            showAlert("error", "Error al crear el evento");
        } finally {
            setIsSubmitting(false);
        }
    };

    const showAlert = (type, description) => {
        setAlert({
            type,
            description,
            show: true
        });
    };

    const handleClose = () => {
        // Resetear formulario al cerrar
        setFormData({
            name: '',
            type: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            capacity: '',
            description: ''
        });
        onClose();
    };

    // Obtener la fecha mínima (hoy)
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} bgColor={"#323132"}>
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-200 mb-2">Crear nuevo evento</h2>
                        <p className="text-gray-500">
                            Completa la información para registrar un nuevo evento en el sistema.
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre del evento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre del evento *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ej: Clase de Yoga, Torneo de Baloncesto, etc."
                                className="w-full p-3 border bg-[#323132] border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                required
                            />
                        </div>

                        {/* Tipo de evento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tipo de evento
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Deporte, Recreación, Capacitación, etc."
                                    className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Fechas y horas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Fecha de inicio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de inicio *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        min={getToday()}
                                        className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Hora de inicio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Hora de inicio *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Fecha de fin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Fecha de fin *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate || getToday()}
                                        className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Hora de fin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Hora de fin *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Capacidad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Capacidad máxima *
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 20, 50, 100"
                                    min="1"
                                    max="1000"
                                    className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Número máximo de participantes que pueden asistir al evento
                            </p>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe el evento, requisitos, materiales necesarios, etc."
                                rows="3"
                                className="w-full p-3 bg-[#323132] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <Save size={18} />
                                {isSubmitting ? 'Creando...' : 'Crear evento'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

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

export default CreateEventModal;