import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../Controllers/productController.js';
import { authorize } from '../Middleware/roleMiddleware.js';
import { roles } from '../Middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/addProduct',authorize(roles.ADMIN), createProduct)
router.put('/update/productId',authorize(roles.ADMIN), updateProduct)
router.delete('/removeProduct', authorize(roles.ADMIN), deleteProduct)



export default router;