const BASE_URL = 'http://localhost:8080/compu2-class/api/user-routines';

// Obtener todas las user routines
export async function fetchAllUserRoutines(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error al cargar todas las rutinas de usuario");
    return res.json();
}

// Obtener user routine por ID
export async function fetchUserRoutineById(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error al cargar la rutina de usuario");
    return res.json();
}

// Crear user routine
export async function createUserRoutine(data, token) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creando la rutina de usuario");
    return res.json();
}

// Actualizar user routine
export async function updateUserRoutine(id, data, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error actualizando la rutina de usuario");
    return res.json();
}

// Eliminar user routine
export async function deleteUserRoutine(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error eliminando la rutina de usuario");
    return res.text();
}

// Obtener rutinas por usuario
export async function fetchUserRoutinesByUser(userId, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error obteniendo rutinas por usuario");
    return res.json();
}

// Obtener rutinas por rutina (por id de rutina)
export async function fetchUserRoutinesByRoutine(routineId, token) {
    const res = await fetch(`${BASE_URL}/routine/${routineId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error obteniendo rutinas por rutina");
    return res.json();
}
