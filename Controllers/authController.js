import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

 export const setCookieAfterLogin = (res, userId, username, role) => {
    const token = jwt.sign(
        {userId, username, role},
        'PasswordSegreta123321',
        {expiresIn: '1h'}    
)
res.cookie("authToken", token, {secure: false, hhttpOnly: true, maxAge: 100000})
    
}

export const alsoAuthorize = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (userRole !== requiredRole) {
            return res.status(403).json({ error: "Accesso non autorizzato" })
        }
        next()
    }
}

export async function registerUser(req, res) {
    const { username, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })
        if (existingUser) {
            return res.status(409).json({ error: "username già in uso" })
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                role: role || 'User'
            }
        })
        setCookieAfterLogin(res, newUser.id, newUser.username, newUser.role);
        res.status(201).json({ message: "Utente registrato con successo", user: newUser })
    } catch (error) {
        console.error("errore durante la registrazione", error);
        res.status(500).json({ error: "Errore durante la registrazione" })
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await user.findUnique({
            where: { username }
        });
        if (!user || user.password !== password) {
            return res.status(404).json({ result: false, message: "Password non valida" })
        }

        setCookieAfterLogin(res, user.userId, user.username, user.role)
        res.json({message: "Login effetutato con successo", user})
    } catch (error) {
        console.error("errore durante il login", error);
        res.status(500).json({ error: "Errore durante il login" })

    }
}


export const getUserProfile = async (req, res) => {
    const userId = req.user.userId;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Autenticazione richiesta" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(401).json({ result: false, message: "Utente non trovato" });
        }
        const decodedToken = jwt.verify(token, 'PasswordSegreta123321');

        if (!decodedToken || decodedToken.userId !== userId) {
            return res.status(401).json({ message: "Token non valido" })
        }
        const userProfile = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        if (user.role === 'Admin') {
            return res.json(userProfile)
        }
        res.json(userProfile)
    } catch (error) {
        console.error("Errore durante il recupero del profilo")
        res.status(500).json({ error: "Errore nel recupero del profilo" })
    }
}

