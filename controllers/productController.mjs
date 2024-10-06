import * as ProductModel from '../models/product.mjs';
//import { uploadImageAndGetUrl } from '../service/imgStorage.mjs';

export const getAllProducts = (req, res) => {
    ProductModel.getAllProducts((err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            // En caso de error, devuelve un mensaje de error con código de estado 500
            return res.status(500).json({ message: 'Error fetching products' });
        }
        // Si no hay error, devuelve los productos con código de estado 200
        res.status(200).json(products);
    });
};

export const updateProduct = (req, res) => {
    const productId = req.params.id; // El ID del producto a actualizar
    const productData = req.body; // Los datos del producto a actualizar desde el cuerpo de la solicitud

    // Llamamos al modelo para actualizar el producto
    ProductModel.updateProduct(productId, productData, (err, updatedProduct) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ message: 'Error updating product' });
        }
        res.status(200).json(updatedProduct); // Devolvemos el producto actualizado
    });
};

// Crear un producto nuevo
export const createProduct = (req, res) => {
    const productData = req.body; // Datos del producto desde el cuerpo de la solicitud

    // Llamamos al modelo para crear el producto
    ProductModel.createProduct(productData, (err, newProduct) => {
        if (err) {
            console.error('Error creating product:', err);
            return res.status(500).json({ message: 'Error creating product' });
        }
        res.status(201).json(newProduct); // Devolvemos el producto creado
    });
};

export const deleteProduct = (req, res) => {
    const productId = req.params.id; // El ID del producto a eliminar

    // Llamamos al modelo para eliminar el producto
    ProductModel.deleteProduct(productId, (err, deletedProduct) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Error deleting product' });
        }
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct }); // Devolvemos un mensaje de éxito
    });
};


/*
export const updateProduct = async (req, res) => {
    const productId = req.params.id; // El ID del producto a actualizar
    const productData = req.body; // Los datos del producto a actualizar desde el cuerpo de la solicitud
    console.log(req.body)
    try {
        // Verifica si se ha subido un archivo y procesalo
        let imageUrl = productData.imageUrl; // Utiliza la URL de la imagen existente por defecto
        if (req.file) {
            // Si se ha subido un archivo, sube la imagen y obtén la URL
            imageUrl = await uploadImageAndGetUrl(req.file.buffer, req.file.originalname);
        }

        // Actualiza el producto con los nuevos datos y la nueva URL de la imagen si se ha proporcionado
        ProductModel.updateProduct(productId, { ...productData, imageUrl }, (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ message: 'Error updating product' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Error processing image upload:', error);
        return res.status(500).json({ message: 'Error processing image upload' });
    }
};
export const createProduct = async (req, res) => {
    const productData = req.body; // Los datos del producto desde el cuerpo de la solicitud

    try {
        // Verifica si se ha subido un archivo y procésalo
        let imageUrl;
        if (req.file) {
            // Si se ha subido un archivo, sube la imagen y obtén la URL
            imageUrl = await uploadImageAndGetUrl(req.file.buffer, req.file.originalname);
        } else {
            // Si no se sube una imagen, puedes decidir usar una imagen predeterminada o dejarla en blanco
            imageUrl = ''; // O la URL de una imagen predeterminada
        }

        // Crea el producto con los datos proporcionados y la URL de la imagen
        const newProductData = { ...productData, imageUrl }; // Asegúrate de incluir otros campos necesarios del formulario

        // Llama al modelo para crear el producto en la base de datos
        ProductModel.createProduct(newProductData, (err, result) => {
            if (err) {
                console.error('Error creating product:', err);
                return res.status(500).json({ message: 'Error creating product' });
            }
            res.status(201).json({ message: 'Product created successfully', product: result });
            req.io.emit('productCreateAdmin', { message: 'Product list updated' });
        });
    } catch (error) {
        console.error('Error processing image upload:', error);
        return res.status(500).json({ message: 'Error processing image upload' });
    }
};*/