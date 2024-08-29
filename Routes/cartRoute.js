import express from 'express';
import { PrismaClient } from '@prisma/client';
import { addTocart, removeCartItem, updateCartItem, viewCart } from '../Controllers/cartController.js';
import { authorize } from '../Middleware/roleMiddleware.js';
import { roles } from '../Middleware/authMiddleware.js';
const prisma = new PrismaClient();
const router = express.Router();


router.post('/add/cart',authorize(roles.USER, roles.ADMIN), addTocart)
router.get('/cart', authorize(roles.USER, roles.ADMIN), viewCart)
router.get('/cart/update/:cartItemId',authorize(roles.USER, roles.ADMIN), updateCartItem)
router.delete('/cart/remove/:cartItemId',authorize(roles.USER, roles.ADMIN), removeCartItem)


export default router;