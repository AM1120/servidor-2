
import { pool } from "../conexion.mjs";

// Crear un producto nuevo
export const createCliente = async (userData, callback) => {
    const { nombres, apellidos, contrasena, n_doc, t_doc } = userData; // Destructuramos stock e img directamente

    if (!nombres || !apellidos || !contrasena || !n_doc || !t_doc == null) {
        return callback({ message: 'Faltan datos requeridos' }, null);
    }

    // Consulta SQL para insertar un nuevo producto, incluyendo el campo stock y la URL de la imagen
    const query = `
        INSERT INTO usuarios (nombres, apellidos, contrasena, n_doc, t_doc, t_rol)
        VALUES ($1, $2, $3, $4, $5, $6);
    `;

    // Usamos directamente la URL que viene en el campo img
    const values = [nombres, apellidos, contrasena,n_doc,t_doc, 1];

    try {
        const res = await pool.query(query, values); // Ejecutamos la consulta
        if (res.rowCount > 0) {
            callback(null, { message: 'Cliente creado exitosamente' });
        }
    } catch (err) {
        console.error('Error al crear el producto:', err);
        callback(err,null); // En caso de error, lo devolvemos al controlador
    }
};


export const login = async (loginData, callback)=>{

    const { n_doc, contrasena } = loginData;

    if (!contrasena || !n_doc == null) {
        return callback({ message: 'Faltan datos requeridos' }, null);
    }

    // Consulta SQL para insertar un nuevo producto, incluyendo el campo stock y la URL de la imagen
    const query = `
        SELECT * 
        FROM usuarios
        WHERE n_doc = $1 AND contrasena = $2;
    `;

    // Usamos directamente la URL que viene en el campo img
    const values = [n_doc, contrasena];

    try {
        const res = await pool.query(query, values); // Ejecutamos la consulta
        if (res.rows.length > 0) {
            const user = res.rows[0]; // Obtenemos el primer usuario encontrado
            callback(null, { message: 'Login exitoso', user });
        } else {
            callback({ message: 'Credenciales incorrectas' }, null);
        }
    } catch (err) {
        console.error('Error en el login:', err);
        callback(err, null); // En caso de error, lo devolvemos al controlador
    }
}