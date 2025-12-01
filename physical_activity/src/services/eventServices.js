const BASE_URL = 'http://localhost:8080/compu2-class/api/events';

// Obtener todos los eventos
export async function fetchEvents(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar eventos');
    return res.json();
}

// Obtener un evento por ID
export async function fetchEvent(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Evento no encontrado');
    return res.json();
}

// Crear un nuevo evento
export async function createEvent(data, token) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creando evento');
    return res.json();
}

// Actualizar un evento
export async function updateEvent(id, data, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error actualizando evento');
    return res.json();
}

// Eliminar un evento
export async function deleteEvent(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Error eliminando evento');
    return res.ok; // Devuelve boolean en lugar de text() como en el ejemplo original
}