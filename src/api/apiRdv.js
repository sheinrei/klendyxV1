import express from "express";
const routerApiRdv = express.Router()
import sendFile from "../service/sendFile.js";

//securité
import authMiddleware from "../middleware/authMiddleware.js";

//instance bdd
import db from "../sequelize.js";


import { createEvent } from "../service/event/createEvent.js";
import { sendNewEvent } from "../service/mailer/sendNewEvent.js";
import generateToken from "../service/token/generateToken.js";
import { updateEvent, updateStateEvent } from "../service/event/updateEvent.js";
import { getEvent } from "../service/event/getEvent.js";
import { decrementCredit } from "../service/credit/decrementCredit.js";
import { deleteEvent } from "../service/event/deleteEvent.js";
import { sendSMS } from "../service/sms/sendSms.js";



//creation d'un event depuis le formulaire créer un evenement
routerApiRdv.post("/create", authMiddleware, (async (req, res) => {

    const id = req.userId
    const create = await createEvent(db, req);
    const idEvent = create.create.id;

    if (!create) {
        return res.json({ success: false, message: create.message })
    }

    const plateforme = req.body.plateformSender;
    let plateformeSms;
    let plateformeEmail;

    if (plateforme.includes("sms")) {
        plateformeSms = true
    }
    if (plateforme.includes("email")) {
        plateformeEmail = true
    }

    if (plateformeEmail) {
        const email = req.body.recipientContactEmail;
        const token = await generateToken(id, "validationEventEmail", db);
        const url = `${process.env.HOST}/api/rdv/valid/${token}/${id}/${idEvent}`;
        const send = await sendNewEvent(req, url, email, res);
        if (send.success) {
            await decrementCredit(db, req, "mail")
            await updateStateEvent(id, idEvent, db, "Email envoyé, en attente de reponse.")
            return res.json({ success: true, message: send.message })
        }
    }

    //Route a faire pour la gestion par sms
    if (plateformeSms) {

        const sendSms = await sendSMS(req.body.recipientContactSms, `${req.body.titleEvent}.\n${req.body.messageEvent}`);

        console.log(sendSMS)
        if (!sendSms.success) {
            await decrementCredit(db, req, "sms")
            await updateStateEvent(id, db, idEvent, "Sms envoyé, en attente de reponse.")
            return res.json({ success: false, message: sendSms.message })
        }
        return res.json({ success: true, message: sendSms.message })
    }
}))



//formulaire d'acceptation du receveur
routerApiRdv.get("/valid/:token/:id/:idEvent", (req, res) => {

    sendFile("/public/pageHtml/formValidEvent.html", res)
})

//api update Event
routerApiRdv.post("/update", async (req, res) => {
    const update = await updateEvent(req, db);

    if (update.success == true) {
        res.json({ success: true, message: update.message })
    }
})

//get tout les events de l'user
routerApiRdv.get("/get", authMiddleware, async (req, res) => {
    const event = await getEvent(db, req);

    if (event.success == true) {
        res.json({ success: true, event })
    }
})

//supprimer un event (paranoid:true)
routerApiRdv.post("/delete", authMiddleware, async (req, res) => {

    const deleteE = await deleteEvent(db, req)
    if (deleteE) {
        return res.json({ success: true, message: "Evenement archivé" })
    }

    return res.json({ success: false, message: "Echec survenue avec le serveur, nous n'avons pas pu supprimer cet evenement." })
})


export default routerApiRdv