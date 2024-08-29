import express from 'express';
import { createUser , getUserById, updateUser, deleteUser } from '../Controllers/userController.js';
import { authorize } from '../Middleware/roleMiddleware.js';
import { roles } from '../Middleware/authMiddleware.js';


const router = express.Router();

router.post('/createuUser', createUser)
router.get('/:id',authorize(roles.ADMIN), getUserById)
router.put('/updateUser', authorize(roles.ADMIN), updateUser)
router.delete('/deleteUser',authorize(roles.ADMIN), deleteUser)


export default router


