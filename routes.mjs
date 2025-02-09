import express from 'express';
import * as productController from './controllers/productController.mjs'
import * as userController from './controllers/userController.mjs'

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


router.get('/product', productController.getAllProducts)
router.put('/product/:id',productController.updateProduct)
router.post('/product-create',productController.createProduct)
router.delete('/product/:id', productController.deleteProduct);

router.post('/crear-cliente',userController.createUser)
router.post('/login',userController.login)


export default router;
