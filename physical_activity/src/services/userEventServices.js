const BASE_URL = 'http://localhost:8080/compu2-class/api/user-events';

// Registrar usuario a evento
export async function registerUserToEvent(userId, eventId, token) {
    const res = await fetch(`${BASE_URL}?userId=${userId}&eventId=${eventId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error registrando usuario al evento');
    return res.json();
}

// Obtener eventos en los que está inscrito un usuario
export async function fetchUserEvents(userId, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error obteniendo eventos del usuario');
    return res.json();
}

// Marcar asistencia al evento
export async function markAttendance(userEventId, attended, token) {
    const res = await fetch(`${BASE_URL}/${userEventId}/attendance?attended=${attended}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al marcar asistencia');
    return res.json();
}

// Cancelar inscripción a un evento
export async function cancelRegistration(userEventId, token) {
    const res = await fetch(`${BASE_URL}/${userEventId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error cancelando inscripción');
    return true;
}

// Obtener TODAS las inscripciones
export async function fetchAllUserEvents(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error obteniendo todas las inscripciones');
    return res.json();
}

// Obtener inscripciones por evento
export async function fetchUserEventsByEvent(eventId, token) {
    const res = await fetch(`${BASE_URL}/event/${eventId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error obteniendo inscripciones del evento');
    return res.json();
}
