import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MapPin, Users, Save, X } from "lucide-react";
import { createSpace } from "@/services/spaceServices";
import Modal from "@/components/Modal.jsx";
import NotificationAlert from "@/components/NotificationAlert.jsx";

const CreateSpaceModal = ({ isOpen, onClose, onSpaceCreated }) => {
    const token = useSelector(state => state.user.token);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ type: "", description: "", show: false });

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        location: '',
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
            showAlert("error", "El nombre del espacio es requerido");
            return;
        }

        if (!formData.location.trim()) {
            showAlert("error", "La ubicación del espacio es requerida");
            return;
        }

        if (!formData.capacity || formData.capacity <= 0) {
            showAlert("error", "La capacidad debe ser un número mayor a 0");
            return;
        }

        try {
            setIsSubmitting(true);

            // Preparar datos para enviar
            const spaceData = {
                name: formData.name.trim(),
                location: formData.location.trim(),
                capacity: parseInt(formData.capacity),
                description: formData.description.trim() || null
            };

            const newSpace = await createSpace(spaceData, token);

            // Mostrar notificación de éxito
            showAlert("success", "Espacio creado correctamente");

            // Resetear formulario
            setFormData({
                name: '',
                location: '',
                capacity: '',
                description: ''
            });

            // Notificar al componente padre
            if (onSpaceCreated) {
                onSpaceCreated(newSpace);
            }

            // Cerrar modal después de un breve delay para que se vea la notificación
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (err) {
            console.error("Error creando espacio:", err);
            showAlert("error", "Error al crear el espacio");
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
            location: '',
            capacity: '',
            description: ''
        });
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} bgColor={"#323132"}>
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-200 mb-2">Crear nuevo espacio</h2>
                        <p className="text-gray-500">
                            Completa la información para registrar un nuevo espacio en el sistema.
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre del espacio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre del espacio *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ej: Sala de pesas, Estudio de yoga, etc."
                                className="w-full p-3 border bg-[#323132] border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                required
                            />
                        </div>

                        {/* Ubicación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Ubicación *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Piso 1, Ala norte, Edificio principal, etc."
                                    className="w-full p-3 bg-[#323132] pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
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
                                Número máximo de personas que pueden usar el espacio simultáneamente
                            </p>
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
                                {isSubmitting ? 'Creando...' : 'Crear espacio'}
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

export default CreateSpaceModal;