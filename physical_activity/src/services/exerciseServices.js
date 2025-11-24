import {useSelector} from "react-redux";

const BASE_URL = 'http://localhost:8080/compu2-class/api/exercises';

// Obtener todos los ejercicios
export async function fetchExercises(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar ejercicios');
    return res.json();
}

// Obtener un ejercicio por ID
export async function fetchExercise(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Ejercicio no encontrado');
    return res.json();
}

// Crear un nuevo ejercicio
export async function createExercise(data, token) {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creando ejercicio');
    return res.json();
}

// Actualizar un ejercicio
export async function updateExercise(id, data, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error actualizando ejercicio');
    return res.json();
}

// Eliminar un ejercicio
export async function deleteExercise(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error('Error eliminando ejercicio');
    return res.text();
}
