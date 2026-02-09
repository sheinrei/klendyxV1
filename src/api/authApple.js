import express from "express";
const routerAuthCalendarApple = express.Router()
import db from "./../sequelize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveToken } from "../service/token/saveToken.js"
import { createDAVClient } from "tsdav";
import { encrypt, decrypt } from "../service/chiffrement.js";
import { revokeCalendar } from "../service/calendar/CalendarController.js";
import { getToken } from "../service/token/getToken.js";




async function testingAuth(email, password) {
    try {
        const url = process.env.ENV == "dev" ? "http://localhost:5232/" : "https://caldav.icloud.com";
        await createDAVClient({
            serverUrl: url,
            credentials: {
                username: email,
                password: password,
            },
            authMethod: 'Basic',
            defaultAccountType: 'caldav',
        })
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}



routerAuthCalendarApple.post("/auth", authMiddleware, async (req, res) => {
    try {

        const { email, password } = req.body;
        const userId = req.userId;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email ou mot de passe manquant."
            });
        }

        //check si il y a déjà une sync apple
        const tokenAlredyExist = await getToken("AppleSync", userId, db);
        if (tokenAlredyExist.success) {
            const passwordEncrypted = tokenAlredyExist.totalToken.password;
            const passwordStored = decrypt(passwordEncrypted);
            const successAuth = await testingAuth(email, passwordStored)
            if (successAuth) {
                return res.json({
                    success: false,
                    message: "Vous possedez déjà une authentification de votre compte Apple valide."
                })
            } else {
                await revokeCalendar("Apple", db, userId)
                return res.json({
                    success: false,
                    message: "Vous possediez une authentification de votre compte Apple qui a été invalidé, nous avons supprimé cette synchronisation avec Klendyx."
                })
            }
        }


        const passwordCrypt = encrypt(password);
        const validAuth = await testingAuth(email, password);
        if (!validAuth) {
            return res.json({
                success: false,
                message: "L'authentification avec votre compte Apple a échoué, email ou mot de passe invalide."
            })
        }


        let token = { email: email, password: passwordCrypt }
        const authSaved = await saveToken(userId, "AppleSync", token, db)

        if (!authSaved.success) {
            return res.json({
                success: false,
                message: "Une erreur avec le serveur est survenu et n'avons pas pu valider l'authentification avec votre compte Apple."
            })
        }

        return res.json({
            success: true,
            message: "Votre compte apple a été synchronisé avec succès. "
        })

    } catch (err) {
        res.status(401).json({
            error: "Connexion Apple Calendar impossible",
            details: err.message
        });
    }
})


export default routerAuthCalendarApple