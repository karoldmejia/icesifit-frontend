const SPACES_BASE_URL = 'http://localhost:8080/compu2-class/api/spaces';

// Crear un nuevo espacio
export async function createSpace(data, token) {
    const res = await fetch(`${SPACES_BASE_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error creando espacio');
    return res.json();
}

// Obtener todos los espacios
export async function fetchSpaces(token) {
    const res = await fetch(`${SPACES_BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar espacios');
    return res.json();
}

// Obtener un espacio por ID
export async function fetchSpaceById(id, token) {
    const res = await fetch(`${SPACES_BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Espacio no encontrado');
    return res.json();
}

// Actualizar un espacio
export async function updateSpace(id, data, token) {
    const res = await fetch(`${SPACES_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error actualizando espacio');
    return res.json();
}

// Eliminar un espacio
export async function deleteSpace(id, token) {
    const res = await fetch(`${SPACES_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error eliminando espacio');
    return res.text();
}