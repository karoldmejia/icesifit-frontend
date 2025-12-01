const BASE_URL = 'http://localhost:8080/compu2-class/api/recommendations';

// Crear una nueva recomendación
export async function createRecommendation(trainerId, progressId, content, token) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            trainerId: trainerId,
            progressId: progressId,
            content: content
        })
    });
    if (!res.ok) throw new Error('Error creando recomendación');
    return res.json();
}

// Obtener recomendaciones por entrenador
export async function fetchRecommendationsByTrainer(trainerId, token) {
    const res = await fetch(`${BASE_URL}/trainer/${trainerId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar recomendaciones del entrenador');
    return res.json();
}

// Obtener recomendaciones por usuario
export async function fetchRecommendationsByUser(userId, token) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar recomendaciones del usuario');
    return res.json();
}

// Actualizar estado de una recomendación
export async function updateRecommendationStatus(recommendationId, newStatus, token) {
    const res = await fetch(`${BASE_URL}/${recommendationId}/status?newStatus=${encodeURIComponent(newStatus)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error actualizando estado de recomendación');
    return res.json();
}

// Eliminar una recomendación
export async function deleteRecommendation(recommendationId, token) {
    const res = await fetch(`${BASE_URL}/${recommendationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error eliminando recomendación');
    return res.text();
}
