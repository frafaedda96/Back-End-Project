import express from "express";
import product from "./Routes/productRoute.js";
import order from "./Routes/orderRoute.js";
import user from "./Routes/userRoute.js";
import cart from "./Routes/cartRoute.js";
import session, { Session } from "express-session";
import * as crypto from "crypto";
import cookieParser from "cookie-parser";
import auth from "./Routes/authRoute.js";
import { authorize } from "./Middleware/roleMiddleware.js";
import { alsoAuthorize } from "./Controllers/authController.js";
import { authToken } from "./Middleware/authMiddleware.js";
import { assignRole } from "./Controllers/userController.js";
import {roles} from "./Middleware/authMiddleware.js";

const app = express()

app.use(session({
    genid: function (req) {
        return crypto.randomUUID()
    },
    secret: "pass,Speciale,Esercizio",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(express.json())
app.use(cookieParser())


app.use("/productRoute", product)
app.use("/orderRoute", order)
app.use("/authRoute", auth)
app.use("/userRoute", user)
app.use("/cartRoute", cart)


app.use(authToken)
app.use(alsoAuthorize)
app.use("/admin/user/:userId/role", authorize(roles.ADMIN), assignRole)
app.use("/editor/user", authorize(roles.EDITOR), assignRole)
app.use("/users/user", authorize(roles.USER), assignRole)

// Middleware JWT
app.use((req, res, next) => {
    const token = req.headers['Autorizzazione']?.split(' ')[1] || req.body.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, 'PasswordSegreta123321');
            req.user = decoded;
            next()
        } catch (error) {
            console.error('errore durante la verifica del token Jwt,', error.message);
        }
    }
    next()
});

app.listen(3000, () => {
    console.log("Web server in ascolto della porta 3000")
})