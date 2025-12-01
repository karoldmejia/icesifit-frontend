const SCHEDULES_BASE_URL = 'http://localhost:8080/compu2-class/api/schedules';

// Crear un nuevo horario para un espacio
export async function createSchedule(spaceId, data, token) {
    const res = await fetch(`${SCHEDULES_BASE_URL}/space/${spaceId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error creando horario');
    return res.json();
}

// Obtener todos los horarios
export async function fetchSchedules(token) {
    const res = await fetch(`${SCHEDULES_BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar horarios');
    return res.json();
}

// Obtener horarios por espacio
export async function fetchSchedulesBySpace(spaceId, token) {
    const res = await fetch(`${SCHEDULES_BASE_URL}/space/${spaceId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar horarios del espacio');
    return res.json();
}

// Actualizar un horario
export async function updateSchedule(id, data, token) {
    const res = await fetch(`${SCHEDULES_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error actualizando horario');
    return res.json();
}

// Eliminar un horario
export async function deleteSchedule(id, token) {
    const res = await fetch(`${SCHEDULES_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error eliminando horario');
    return res.text();
}