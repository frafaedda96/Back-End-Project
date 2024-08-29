
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createOrder, deleteOrder, getOrderById, getUserAllOrders, updateOrder } from '../Controllers/orderController.js';
import { authorize } from '../Middleware/roleMiddleware.js';
import { roles } from '../Middleware/authMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// rotte per oottenere tutti gli oridni 
router.get('/',authorize(roles.ADMIN), getUserAllOrders)
// Come ottenere ordine per ID
router.get('/:id',authorize(roles.ADMIN), getOrderById)
// crea nuovo ordine
router.post('/addOrder',authorize(roles.USER, roles.EDITOR), createOrder)
// Aggiorna ordini esistenti
router.put('/:id',authorize(roles.USER, roles.EDITOR), updateOrder)
// eliminazione di un ordine
router.delete('/removeOrder' ,authorize(roles.USER, roles.EDITOR), deleteOrder)

export default router;


