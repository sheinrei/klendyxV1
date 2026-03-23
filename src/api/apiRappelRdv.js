import express from "express";
const routerApiRappelRdv = express.Router()
import db from "../sequelize.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { getRappelRdvById, getUserRappelRdv } from "../service/rappelRdv/getRappelRdv.js";
import { deleteRappelRdv } from "../service/rappelRdv/deleteRappelRdv.js";
import { createRappelRdv } from "../service/rappelRdv/createRappelRdv.js";
import { Credit } from "../service/credit/ClassCredit.js";


routerApiRappelRdv.get("/", authMiddleware, async (req, res) => {
    try {

        const userId = req.userId
        const rappels = await getUserRappelRdv(db, userId)

        return res.status(rappels.success ? 200 : 400).json({
            success: rappels.success,
            message: rappels.message,
            data: rappels.data
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Erreur serveur impossible de récupérer les rappels de rendez-vous"
        })
    }
})



routerApiRappelRdv.delete("/:rappelId", authMiddleware, async (req, res) => {
    try {
        const { rappelId } = req.params

        const thisEvent = await getRappelRdvById(db, Number(rappelId));
        const eventState = thisEvent.data.dataValues.state;
        let message;
        const deleted = await deleteRappelRdv(rappelId, db)
        message = deleted.message


        //check si le rappel a été délanché pour rembourser le credit auquel cas
        if (eventState.sms.sentAt === null && eventState.email.sentAt === null && deleted.success) {
            const array = thisEvent.data.dataValues.method.split("-")

            for(let i = 0; i < array.length ; i++){
                await new Credit(req.userId).incrementCredit(array[i])
            }
                message += "Les crédits utilisés pour ce rappel de rendez-vous ont été restaurés"
        }


        return res.status(deleted.success ? 200 : 400).json({
            success: deleted.success,
            message: message,
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Erreur serveur impossible de récupérer les rappels de rendez-vous"
        })
    }
})




/**
 * Création d'un nouveau rappel de rendez-vous
 */
routerApiRappelRdv.post("/create", authMiddleware, async (req, res) => {
    try {
        const { phone, email, method, dayEvent, timeBefore, hourStart, hourEnd, nom, prenom } = req.body
        const userId = req.userId

        //check si il y a assez de credits pour l'opération
        const credit = await new Credit(userId).getCredit()
        console.log(credit)
        const methodIsSms = method.includes("sms")
        const methodIsEmail = method.includes("email")

        if (methodIsSms && (credit.data.sms < 1)) {
            return res.status(404).json({
                success: false,
                message: "Crédit d'envoi de sms insuffisant pou réaliser un rappel de rendez-vous par SMS."
            })
        }
        if (methodIsEmail && (credit.email < 1)) {
            return res.status(404).json({
                success: false,
                message: "Crédit d'envoi d'email insuffisant pou réaliser un rappel de rendez-vous par email."
            })
        }


        //créer le rdv dans la base
        const created = await createRappelRdv(db, userId, phone, email, method, dayEvent, timeBefore, hourStart, hourEnd, nom, prenom)
        const CreditInstance = new Credit(userId)
        //si creation success decrement credit selon la method
        if (created.success && methodIsSms) {
            await CreditInstance.decrementCredit("sms")
        }

        if (created.success && methodIsEmail) {
            await CreditInstance.decrementCredit("email")
        }

        //renvois de la donnee
        return res.status(created.success ? 200 : 400).json({
            success: created.success,
            message: created.message,
            idEvent: created.id,
            state: created.state,
            dayEvent: created.dayEvent
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: process.env.MEMESSAGE_ERREUR_SERVEUR,
            error: err
        })
    }
})

export default routerApiRappelRdv