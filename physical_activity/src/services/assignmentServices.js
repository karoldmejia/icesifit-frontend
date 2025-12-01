const BASE_URL = 'http://localhost:8080/compu2-class/api/assignments';

// Asignar un entrenador a un usuario
export async function assignTrainer(trainerId, userId, token) {
    const res = await fetch(`${BASE_URL}/trainer/${trainerId}/user/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al asignar entrenador');
    return res.json();
}

// Actualizar estado de una asignación
export async function updateAssignmentStatus(assignmentId, newStatus, token) {
    const res = await fetch(`${BASE_URL}/${assignmentId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStatus })
    });
    if (!res.ok) throw new Error('Error actualizando estado de asignación');
    return res.json();
}

// Obtener asignaciones por entrenador
export async function fetchAssignmentsByTrainer(trainerId, token) {
    const res = await fetch(`${BASE_URL}/trainer/${trainerId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar asignaciones del entrenador');
    return res.json();
}

// Obtener asignaciones por usuario
export async function fetchAssignmentsByUser(userId, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar asignaciones del usuario');
    return res.json();
}

// Eliminar una asignación
export async function deleteAssignment(assignmentId, token) {
    const res = await fetch(`${BASE_URL}/${assignmentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error eliminando asignación');
    return res.text();
}