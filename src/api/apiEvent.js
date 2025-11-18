import express from "express";
const routerApiEvent = express.Router()
import sendFile from "./../service/sendFile.js";

//securité
import authMiddleware from "./../middleware/authMiddleware.js";

//instance bdd
import db from "./../sequelize.js";


import { createEvent } from "./../service/event/createEvent.js";
import { sendNewEvent } from "./../service/mailer/sendNewEvent.js";
import generateToken from "./../service/token/generateToken.js";
import { updateEvent, updateStateEvent } from "./../service/event/updateEvent.js";
import { getEvent } from "../service/event/getEvent.js";
import { decrementCredit } from "../service/credit/decrementCredit.js";
import { deleteEvent } from "../service/event/deleteEvent.js";
import { sendSMS } from "../service/sms/sendSms.js";
import { createMatchingEvent } from "../service/event/createMatchingEvent.js";
import { sendMatchingEvent } from "../service/mailer/sendMatchingEvent.js";
import { getMatchingEvent } from "../service/event/getMatchingEvent.js";
import { addRevolveMatchingEvent, updateMatchingEvent } from "../service/event/updateMatchingEvent.js";
import { resolveMatchingEvent } from "../service/event/resolveMatchingEvent.js";
import { sendResolvMatching } from "../service/mailer/sendResolvMatching.js";
import { getUserData } from "../service/user/getUserData.js";
import { addNewEventGoogle } from "../service/google/addnewEvent.js";
import { getToken } from "../service/token/getToken.js";
import { deleteMatchingEvent } from "../service/event/deleteMatchingEvent.js";
import { sendValidationMatching } from "../service/mailer/sendValidationMatching.js";


// Les routes :

//creation d'un event depuis le formulaire créer un evenement
routerApiEvent.post("/create", authMiddleware, (async (req, res) => {

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
        const url = `${process.env.HOST}/api/event/valid/${token}/${id}/${idEvent}`;
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
routerApiEvent.get("/valid/:token/:id/:idEvent", (req, res) => {

    sendFile("/public/pageHtml/formValidEvent.html", res)
})

//api update Event
routerApiEvent.post("/update", async (req, res) => {
    const update = await updateEvent(req, db);

    if (update.success == true) {
        res.json({ success: true, message: update.message })
    }
})

//get tout les events de l'user
routerApiEvent.get("/get", authMiddleware, async (req, res) => {
    const event = await getEvent(db, req);

    if (event.success == true) {
        res.json({ success: true, event })
    }
})

//supprimer un event (paranoid:true)
routerApiEvent.post("/delete", authMiddleware, async (req, res) => {

    const deleteE = await deleteEvent(db, req)
    if (deleteE) {
        return res.json({ success: true, message: "Evenement archivé" })
    }

    return res.json({ success: false, message: "Echec survenue avec le serveur, nous n'avons pas pu supprimer cet evenement." })
})




// matching Event
routerApiEvent.post("/matching-event/create", authMiddleware, async (req, res) => {
    try {
        const contacts = req.body.contact
        const create = await createMatchingEvent(db, req)
        if (!create.success) {
            return res.json({ success: false, message: create.message })
        }
        for (const contact of contacts) {
            const url = `${process.env.HOST}/matching-rdv/${create.token}/${contact}`
            const send = await sendMatchingEvent(req, url, contact)
            console.log(send)
        }
    } catch (err) {
        console.log(err)
        return res.json({ success: false, message: "Erreur survenu", err })
    }
    return res.json({ success: true, message: "notification envoyé" })
})

routerApiEvent.get("/matching-event/get", async (req, res) => {
    const { token } = req.query
    const event = await getMatchingEvent(db, token);
    if (!event.success) {
        return res.json({ success: false, message: event.message })
    }
    return res.json({ success: true, event })
})

routerApiEvent.post("/matching-event/update", async (req, res) => {
    const updated = await updateMatchingEvent(db, req)
    if (!updated.success) {
        return res.json({ success: false, message: updated.message })
    }
    const undisponibility = updated.data.undisponibility
    const allValidate = Object.values(undisponibility).every(objet => objet.validate === true)
    let idUserOrigin = updated.data.idUser


    //Lancement process si tout le monde a répondu à rempli ses dispos
    if (allValidate) {
        const { contact, rangeStart, rangeEnd, durationEvent, rangeHoursStart, rangeHoursEnd } = updated.data
        const matching = resolveMatchingEvent(contact, undisponibility, rangeStart, rangeEnd, durationEvent, rangeHoursStart, rangeHoursEnd);

        const update = await addRevolveMatchingEvent(db, matching, req)

        if (update.success) {
            const userOrigin = await getUserData(req, db, idUserOrigin)
            const email = userOrigin.email
            const url = `${process.env.HOST}/matching-rdv/validate?token=${updated.data.token}`
            const title = updated.eventTitle
            const sending = await sendResolvMatching(email, title, url);
        }
    }
    return res.json({ success: true, message: updated.message, })
})

routerApiEvent.post("/matching-event/final", async (req, res) => {

    const { token, addGoogle, titleEvent, dateEventString, hoursStartString, hoursEndString } = req.body
    const dataEvent = await getMatchingEvent(db, token)
    if (!dataEvent) {
        return res.json({ success: false, message: "Cet evenement est déjà cloturé ou n'existe pas." })
    }

    //Enregistrer l'event dans le calendar google de l'initialisateur
    const idUser = dataEvent.data.idUser

    let eventGoogle = null;

    if (addGoogle) {
        const tokenGoogle = await getToken("RefreshTokenGoogle", idUser, db);
        if (tokenGoogle.success) {
            eventGoogle = await addNewEventGoogle(tokenGoogle, dataEvent, req);
        }
    }

    //delete l'event qui est fini
    const deletedEvent = deleteMatchingEvent(db, token)
    if(!deletedEvent.successs){
        console.log("erreur dans la suppression de l'eventMatching")
    }

    const contactSendSuccess = []
    //send email à tout les participants
    dataEvent.data.contact.forEach((email)=>{
        const send = sendValidationMatching(email, idUser, titleEvent, dateEventString, hoursStartString, hoursEndString)
        .then(()=>contactSendSuccess.push(send.success))
    })

    return res.json({
        success:true,
        google : eventGoogle.success,
        contactSending : contactSendSuccess
    })
})

export default routerApiEvent