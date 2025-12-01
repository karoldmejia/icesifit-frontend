const BASE_URL = 'http://localhost:8080/compu2-class/api/routine-exercises';

// Obtener todos los routine-exercises
export async function fetchRoutineExercises(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar routine-exercises');
    return res.json();
}

// Obtener routine-exercises por ID
export async function fetchRoutineExercise(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('RoutineExercise no encontrado');
    return res.json();
}

// Crear un routine-exercise
export async function createRoutineExercise(data, token) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error creando routine-exercise');
    return res.json();
}

// Actualizar un routine-exercise
export async function updateRoutineExercise(id, data, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error actualizando routine-exercise');
    return res.json();
}

// Eliminar un routine-exercise
export async function deleteRoutineExercise(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error eliminando routine-exercise');
    return res.text();
}

// Obtener todos los routine-exercises de una rutina específica
export async function fetchRoutineExercisesByRoutine(routineId, token) {
    const res = await fetch(`${BASE_URL}/routine/${routineId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar routine-exercises de la rutina');
    return res.json();
}

// Obtener todos los routine-exercises de una UserRoutine específica
export async function fetchRoutineExercisesByUserRoutine(userRoutineId, token) {
    const res = await fetch(`${BASE_URL}/user-routine/${userRoutineId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar routine-exercises de la UserRoutine');
    return res.json();
}


// Obtener todos los routine-exercises de un ejercicio específico
export async function fetchRoutineExercisesByExercise(exerciseId, token) {
    const res = await fetch(`${BASE_URL}/exercise/${exerciseId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar routine-exercises del ejercicio');
    return res.json();
}

export async function fetchExerciseById(id, token) {
    const res = await fetch(`http://localhost:8080/compu2-class/api/exercises/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error fetching exercise');
    return res.json();
}
