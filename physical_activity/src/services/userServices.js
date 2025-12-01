const BASE_URL = 'http://localhost:8080/compu2-class/api/users';

// Obtener todos los usuarios
export async function fetchUsers(token) {
    const res = await fetch(BASE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error al cargar usuarios");
    return res.json();
}

// Obtener usuario por id
export async function fetchUserById(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Usuario no encontrado");
    return res.json();
}

// Crear usuario
export async function createUser(user, token) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Error creando usuario");
    return res.json();
}

// Actualizar usuario
export async function updateUser(id, user, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Error actualizando usuario");
    return res.json();
}

// Eliminar usuario
export async function deleteUser(id, token) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    if (!res.ok) throw new Error("Error eliminando usuario");
    return res.text();
}

export async function fetchTrainers(token) {
    const res = await fetch(`${BASE_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Error al cargar entrenadores');

    const allUsers = await res.json();
    // Filtrar solo entrenadores
    return allUsers.filter(user =>
        user.role?.name === "Trainer" || user.role?.name === "ROLE_Trainer"
    );
}