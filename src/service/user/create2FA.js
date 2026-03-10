import { saveToken } from "../token/saveToken.js";
import { getUserData } from "./getUserData.js";
import { KlendyxMailer } from "../mailer/ClassMailer.js";


export async function create2FA(db, userId) {

    try {
        let token = "";
        for (let i = 0; i < 6; i++) {
            const generateNumber = Math.floor(Math.random() * 10);
            token += generateNumber;

        }

        const savedToken = await saveToken(userId, "2FA", token, db)

        if (!savedToken.success) {
            return {
                success: false,
                message: "Erreur survenue lors de la création de code de la double authentification"
            }
        }
        const userData = await getUserData(db, userId)
        const email = userData.email

        if (!email) {
            return {
                success: false,
                message: "Impossible d'obtenir l'email lors de la création du code de double authentification"
            }
        }
        const mailer = new KlendyxMailer(email)
        const sending = await mailer.send2FA(token)

        return {
            succes: sending.success,
            message: sending.message
        }

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: process.env.MESSAGE_ERREUR_SERVEUR,
            error: err.message
        }
    }

}   