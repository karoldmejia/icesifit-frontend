const BASE_URL = 'http://localhost:8080/compu2-class/api/routines';

// Obtener todas las rutinas
export async function fetchRoutines(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar rutinas');
    return res.json();
}

// Obtener una rutina por ID
export async function fetchRoutine(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Rutina no encontrada');
    return res.json();
}

// Crear una nueva rutina
export async function createRoutine(data, token) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creando rutina');
    return res.json();
}

// Actualizar una rutina
export async function updateRoutine(id, data, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error actualizando rutina');
    return res.json();
}

// Eliminar una rutina
export async function deleteRoutine(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
    if (!res.ok) throw new Error('Error eliminando rutina');
    return res.text();
}
