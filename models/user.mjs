import { pool } from "../conexion.mjs";

// Crear un cliente nuevo (versión corregida)
export const createCliente = async (userData, callback) => {
    const { nombres, apellidos, contrasena, n_doc, t_doc } = userData;

    // Validación corregida
    if (!nombres || !apellidos || !contrasena || !n_doc || !t_doc) {
        return callback({ message: 'Todos los campos son requeridos' }, null);
    }

    try {
        const query = `
            INSERT INTO usuarios (nombres, apellidos, contrasena, n_doc, t_doc, t_rol)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [nombres, apellidos, contrasena, n_doc, t_doc, 2]; // 2 para rol cliente

        const res = await pool.query(query, values);
        
        if (res.rows.length > 0) {
            const newClient = res.rows[0];
            // Eliminamos la contraseña del objeto antes de devolverlo
            delete newClient.contrasena;
            callback(null, { 
                message: 'Cliente creado exitosamente',
                client: newClient
            });
        } else {
            callback({ message: 'No se pudo crear el cliente' }, null);
        }
    } catch (err) {
        console.error('Error al crear cliente:', err);
        // Manejo específico para duplicados
        if (err.code === '23505') { // Código de error de PostgreSQL para violación de unique
            callback({ message: 'El número de documento ya está registrado' }, null);
        } else {
            callback({ message: 'Error interno del servidor' }, null);
        }
    }
};

// Login mejorado
export const login = async (loginData, callback) => {
    const { n_doc, contrasena } = loginData;

    // Validación corregida
    if (!n_doc || !contrasena) {
        return callback({ message: 'Número de documento y contraseña son requeridos' }, null);
    }

    try {
        // Primero buscamos solo por n_doc
        const query = `
            SELECT * 
            FROM usuarios
            WHERE n_doc = $1;
        `;

        const res = await pool.query(query, [n_doc]);
        
        if (res.rows.length === 0) {
            return callback({ message: 'Credenciales incorrectas' }, null);
        }

        const user = res.rows[0];
        
        // Comparación básica de contraseña (deberías usar bcrypt en producción)
        if (user.contrasena !== contrasena) {
            return callback({ message: 'Credenciales incorrectas' }, null);
        }

        // Eliminamos la contraseña del objeto antes de devolverlo
        delete user.contrasena;
        
        callback(null, { 
            message: 'Login exitoso',
            user
        });
    } catch (err) {
        console.error('Error en el login:', err);
        callback({ message: 'Error interno del servidor' }, null);
    }
};