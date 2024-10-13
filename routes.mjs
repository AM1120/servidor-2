import express from 'express';
import * as productController from './controllers/productController.mjs'
import * as userController from './controllers/userController.mjs'

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


router.get('/products', productController.getAllProducts)
router.put('/products/:id',productController.updateProduct)
router.post('/product-create',productController.createProduct)
router.delete('/products/:id', productController.deleteProduct);

router.post('/crear-cliente',userController.createUser)
router.post('/login',userController.login)


export default router;
