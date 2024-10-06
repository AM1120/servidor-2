// products.mjs
import { pool } from "../conexion.mjs";
//import { uploadImageAndGetUrl } from "../service/imgStorage.mjs";

/**
 * Obtener todos los productos
 * @param {function} callback - Función de callback para manejar la respuesta
 */
export const getAllProducts = async (callback) => {
    try {
        const res = await pool.query('SELECT * FROM productos;');
        const products = res.rows; // Los resultados ya están en formato JSON

        callback(null, products);
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        callback(err, null);
    }
};

export const updateProduct = async (productId, productData, callback) => {
    const { nombre, descripcion, img, precio, stock } = productData; // Ahora también destructuramos stock

    if (!nombre || !precio || stock == null) {
        return callback({ message: 'Nombre, precio y stock son requeridos' }, null);
    }

    // La consulta SQL para actualizar el producto incluyendo stock
    const query = `
        UPDATE productos
        SET nombre = $1, descripcion = $2, img = $3, precio = $4, stock = $5
        WHERE id = $6
        RETURNING *;
    `;

    const values = [nombre, descripcion || null, img || null, precio, stock, productId];

    try {
        const res = await pool.query(query, values); // Ejecutamos la consulta
        const updatedProduct = res.rows[0]; // Obtenemos el producto actualizado
        callback(null, updatedProduct); // Devolvemos el producto actualizado
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        callback(err, null); // En caso de error, lo devolvemos al controlador
    }
};



// Crear un producto nuevo
export const createProduct = async (productData, callback) => {
    const { nombre, descripcion, img, precio, stock } = productData; // Destructuramos stock e img directamente

    if (!nombre || !precio || stock == null) {
        return callback({ message: 'Nombre, precio y stock son requeridos' }, null);
    }

    // Consulta SQL para insertar un nuevo producto, incluyendo el campo stock y la URL de la imagen
    const query = `
        INSERT INTO productos (nombre, descripcion, img, precio, stock)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    // Usamos directamente la URL que viene en el campo img
    const values = [nombre, descripcion || null, img || null, precio, stock];

    try {
        const res = await pool.query(query, values); // Ejecutamos la consulta
        const newProduct = res.rows[0]; // Obtenemos el producto recién creado
        callback(null, newProduct); // Devolvemos el producto creado
    } catch (err) {
        console.error('Error al crear el producto:', err);
        callback(err, null); // En caso de error, lo devolvemos al controlador
    }
};


export const deleteProduct = async (productId, callback) => {
    // La consulta SQL para eliminar el producto
    const query = `
        DELETE FROM productos
        WHERE id = $1
        RETURNING *;
    `;

    try {
        const res = await pool.query(query, [productId]); // Ejecutamos la consulta
        const deletedProduct = res.rows[0]; // Obtenemos el producto eliminado
        callback(null, deletedProduct); // Devolvemos el producto eliminado
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        callback(err, null); // En caso de error, lo devolvemos al controlador
    }
};



/**
 * Actualizar un producto
 * @param {number} productId - ID del producto a actualizar
 * @param {object} productData - Datos del producto a actualizar
 * @param {function} callback - Función de callback para manejar la respuesta
 */
/*
export const updateProduct = async (productId, productData, callback) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let imageUrl = productData.img;
        if (productData.newImage) {
            // Asume que `productData.newImage` es un buffer o un stream de la nueva imagen
            // y que `productData.imageName` contiene el nombre de la nueva imagen.
            imageUrl = await uploadImageAndGetUrl(productData.newImageBuffer, productData.imageName);
        }

        const updateQuery = `
            UPDATE Productos
            SET 
                nombre = $1,
                descripcion = $2,
                img = $3,
                precio = $4,
                stock = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [
            productData.nombre,
            productData.descripcion,
            imageUrl,
            productData.precio,
            productData.stock,
            productId
        ];

        const res = await client.query(updateQuery, values);

        await client.query('COMMIT');

        callback(null, { message: 'Producto actualizado exitosamente', product: res.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error actualizando producto:', err);
        callback(err);
    } finally {
        client.release();
    }
};
*/
/**
 * Crear un nuevo producto
 * @param {object} productData - Datos del nuevo producto
 * @param {function} callback - Función de callback para manejar la respuesta
 */
/*
export const createProduct = async (productData, callback) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let imageUrl;
        if (productData.newImage) {
            // Supongamos que `productData.newImage` contiene el buffer de la nueva imagen
            // y `productData.imageName` contiene el nombre deseado para la imagen.
            imageUrl = await uploadImageAndGetUrl(productData.newImage, productData.imageName);
        } else {
            // Si no se proporciona una nueva imagen, puedes establecer una URL predeterminada o dejarla vacía
            imageUrl = productData.img || '';
        }

        const insertQuery = `
            INSERT INTO Productos (nombre, descripcion, img, precio, stock)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const values = [
            productData.nombre,
            productData.descripcion,
            imageUrl,
            productData.precio,
            productData.stock
        ];

        const res = await client.query(insertQuery, values);

        await client.query('COMMIT');

        // Devuelve el ID del producto recién creado junto con los datos del producto
        callback(null, { id: res.rows[0].id, ...productData, img: imageUrl });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creando producto:', err);
        callback(err);
    } finally {
        client.release();
    }
};
*/