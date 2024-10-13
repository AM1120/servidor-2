import * as UserModel from '../models/user.mjs';



export const createUser= (req, res) => {
    const clienteData = req.body; // Datos del producto desde el cuerpo de la solicitud

    // Llamamos al modelo para crear el producto
    UserModel.createCliente(clienteData, (err,mensaje) => {
        if (err) {
            console.error('Error creating cliente:', err);
            return res.status(500).json({ message: 'Error al crear cliente' });
        }
        res.status(201).json(mensaje); // Devolvemos el cliente creado
    });
};

export const login = (req, res) => {
    const loginData = req.body;
    UserModel.login(loginData, (err,response) => {
        if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.status(500).json(err);
        }
        res.status(200).json(response); // Devolvemos el cliente creado
    });

}