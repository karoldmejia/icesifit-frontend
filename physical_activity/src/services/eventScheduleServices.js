const BASE_URL = 'http://localhost:8080/compu2-class/api/event-schedules';

// Crear un nuevo horario de evento
export async function createEventSchedule(eventId, scheduleId, token) {
    const params = new URLSearchParams({
        eventId: eventId,
        scheduleId: scheduleId
    });

    const res = await fetch(`${BASE_URL}?${params}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error creando horario de evento');
    return res.json();
}

// Actualizar un horario de evento
export async function updateEventSchedule(id, newEventId, newScheduleId, token) {
    const params = new URLSearchParams();
    if (newEventId) params.append('newEventId', newEventId);
    if (newScheduleId) params.append('newScheduleId', newScheduleId);

    const res = await fetch(`${BASE_URL}/${id}?${params}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error actualizando horario de evento');
    return res.json();
}

// Obtener todos los horarios de eventos
export async function fetchAllEventSchedules(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar horarios de eventos');
    return res.json();
}

// Obtener horarios por evento
export async function fetchEventSchedulesByEvent(eventId, token) {
    const res = await fetch(`${BASE_URL}/event/${eventId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar horarios por evento');
    return res.json();
}

// Obtener horarios por schedule
export async function fetchEventSchedulesBySchedule(scheduleId, token) {
    const res = await fetch(`${BASE_URL}/schedule/${scheduleId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar horarios por schedule');
    return res.json();
}

// Eliminar un horario de evento
export async function deleteEventSchedule(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error eliminando horario de evento');
    return res.ok;
}