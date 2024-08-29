import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { setCookieAfterLogin } from './authController.js';

const prisma = new PrismaClient();

export const assignRole = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const {role} = req.body

    try{
        const user = await prisma.user.findUnique({
            where : {id: userId}
        });

        if(!user){
            return res.status(404).json({error: "Utente non trovato"})
        }

        const updateRole = await prisma.user.update({
            where: {id: userId},
            data: {role}
        })
        res.json({ message: "Ruolo assegnato con successo", user: updateRole});

    }catch(error){
        console.error("Errore durante assegnazione del ruolo", error)
        res.status(500).json({error: "Errore durante l'assegnazione del ruolo"})
    }

}


export async function createUser(req, res) {
    const { username, password, role } = req.body
    try {
        const findUser = await prisma.user.findUnique({
            where: { username }
        })
        if (findUser) {
            return res.status(401).json({ error: "Username già in uso" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role
            }
        });

       setCookieAfterLogin({ userId: newUser.id, username: newUser.username, role: newUser.role })
        res.json({ message: "Utente creato con successo", user: newUser })

    } catch (error) {
        console.error("Errore nell'inserimento dell'utente")
        res.status(500).json({ error: "Errore nell'inserimento dell'utente" })

    }

}


export const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id)

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(401).json({ result: false, message: "Utente non trovato" });
        }

        res.json(user)

    } catch (error) {
        console.error("Errore durante il recupero del profilo")
        res.status(500).json({ error: "Errore nel recupero del profilo" })

    }
}


export async function updateUser(req, res) {
    const userId = parseInt(req.params.id)
    const { username, password, role } = req.body

    try {

        let updateUserData = { username, role }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateUserData.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateUserData
        });
        res.json(updatedUser)

    } catch (error) {
        console.error("Errore nella modifica dell'utente")
        res.status(500).json({ error: "Errore nella modifica dell'utente" })

    }
}


export async function deleteUser(req, res) {
    const userId = parseInt(req.params.id)

    try {

        await prisma.user.delete({
            where: { id: userId }
        });
        res.status(204).end()

    } catch (error) {
        console.error("Errore nella cancellazione dell'utente")
        res.status(500).json({ error: "Errore nella cancellazione dell'utente" })

    }
}
