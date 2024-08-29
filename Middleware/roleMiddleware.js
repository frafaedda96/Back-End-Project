import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router()
const prisma = new PrismaClient();

export const authorize = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role
        if(!userRole){
            console.error("Utente non definito o ruolo non specificato")
            return res.status(401).json({error: "Utente non definito o ruolo non specificato"})
        }


        if (!roles.includes(userRole)) {
            console.log("Accesso consentito per il ruolo", userRole)
            next()
        } else {
            console.error("Accesso negato per il ruolo di ", userRole)
            return res.status(403).json({ error: "Accesso consentito solo agli Admin " })
        }

    }

}


