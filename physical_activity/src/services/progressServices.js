const BASE_URL = 'http://localhost:8080/compu2-class/api/progress';

export async function fetchAllProgress(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!res.ok) throw new Error("Error al cargar todo el progreso");
    return res.json();
}

export async function fetchProgressByUser(userId, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!res.ok) throw new Error("Error al cargar el progreso del usuario");
    return res.json();
}

export async function createProgress(userId, data, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error registrando progreso");
    return res.json();
}

export async function updateProgress(progressId, data, token) {
    const res = await fetch(`${BASE_URL}/${progressId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error actualizando progreso");
    return res.json();
}

export async function deleteProgress(progressId, token) {
    const res = await fetch(`${BASE_URL}/${progressId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!res.ok) throw new Error("Error eliminando progreso");
    return res.text();
}

export async function fetchWeeklyProgress(userId, startDate, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}/week?startDate=${startDate}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!res.ok) throw new Error("Error obteniendo progreso semanal");
    return res.json();
}

export async function fetchProgressSummary(userId, start, end, token) {
    const res = await fetch(
        `${BASE_URL}/user/${userId}/summary?start=${start}&end=${end}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
    );

    if (!res.ok) throw new Error("Error obteniendo resumen de progreso");
    return res.json();

}

export async function fetchProgressByRoutineExercise(routineExerciseId, token) {
    const res = await fetch(`${BASE_URL}/routine-exercise/${routineExerciseId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error obteniendo progreso del ejercicio");
    return res.json();
}

export async function fetchWeeklyProgressByRoutine(routineId, startDate, token) {
    const res = await fetch(`${BASE_URL}/routine/${routineId}/week?startDate=${startDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error obteniendo progreso semanal por rutina");
    return res.json();
}

export async function fetchUsersCountByRoutineDaily(routineId, token) {
    const res = await fetch(`${BASE_URL}/routine/${routineId}/daily-count`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error obteniendo usuarios diarios de la rutina");
    return res.json();
}

