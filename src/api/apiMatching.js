import express from "express";
const routerApiMatching = express.Router()

//securité
import authMiddleware from "./../middleware/authMiddleware.js";

//instance bdd
import db from "./../sequelize.js";

import { createMatchingEvent } from "../service/event/createMatchingEvent.js";
import { getMatchingEvent } from "../service/event/getMatchingEvent.js";
import { addRevolveMatchingEvent, updateMatchingEvent } from "../service/event/updateMatchingEvent.js";
import { resolveMatchingEvent } from "../service/event/resolveMatchingEvent.js";
import { KlendyxMailer } from "../service/mailer/ClassMailer.js";
import { getUserData } from "../service/user/getUserData.js";
import { deleteMatchingEvent } from "../service/event/deleteMatchingEvent.js";



// matching Event
routerApiMatching.post("/create", authMiddleware, async (req, res) => {
    try {
        const contacts = req.body.contact
        const create = await createMatchingEvent(db, req)
        if (!create.success) {
            return res.json({ success: false, message: create.message })
        }
        for (const contact of contacts) {
            const url = `${process.env.HOST}/matching-rdv/${create.token}/${contact}`
            const mailer = new KlendyxMailer(contact)
            const send = await mailer.sendNewMatchingEvent(req, url)
            console.log(send)
        }
    } catch (err) {
        console.log(err)
        return res.json({ success: false, message: "Erreur survenu, veuillez réessayer plus tard", err })
    }
    return res.json({ success: true, messageHtml: "Votre matching event a été créé avec succès.<br> Une notification vous sera envoyée par mail lorsque tous les participants auront rempli leurs disponibilités." })
})


routerApiMatching.get("/get", async (req, res) => {
    const { token } = req.query
    const event = await getMatchingEvent(db, token);
    if (!event.success) {
        return res.json({ success: false, message: event.message })
    }
    return res.json({ success: true, event })
})


routerApiMatching.post("/update", async (req, res) => {
    const updated = await updateMatchingEvent(db, req)
    if (!updated.success) {
        return res.json({ success: false, message: updated.message })
    }
    const undisponibility = updated.data.undisponibility
    const allValidate = Object.values(undisponibility).every(objet => objet.validate === true)
    let userIdOrigin = updated.data.userId


    //Lancement process si tout le monde a répondu à rempli ses dispos
    if (allValidate) {
        const { contact, rangeStart, rangeEnd, durationEvent, rangeHoursStart, rangeHoursEnd } = updated.data
        const matching = resolveMatchingEvent(contact, undisponibility, rangeStart, rangeEnd, durationEvent, rangeHoursStart, rangeHoursEnd);

        const update = await addRevolveMatchingEvent(db, matching, req)

        if (update.success) {
            const userOrigin = await getUserData(req, db, userIdOrigin)
            const email = userOrigin.email
            const url = `${process.env.HOST}/matching-rdv/validate?token=${updated.data.token}`
            const mailer = new KlendyxMailer(email)
            const sending = await mailer.sendResolvMatching(url);
        }
    }
    return res.json({ success: true, message: updated.message, })
})


routerApiMatching.post("/final", async (req, res) => {
    const { token, addGoogle, titleEvent, dateEventString, hoursStartString, hoursEndString } = req.body
    const dataEvent = await getMatchingEvent(db, token)
    if (!dataEvent) {
        return res.json({ success: false, message: "Cet evenement est déjà cloturé ou n'existe pas." })
    }

    //Enregistrer l'event dans le calendar google de l'initialisateur
    const userId = dataEvent.data.userId

    let eventGoogle = null;

    //Ajouter l'ajout du l'event dans calendar
    /*
    
    */

    //delete l'event qui est fini
    const deletedEvent = deleteMatchingEvent(db, token)
    if (!deletedEvent.successs) {
        console.log("erreur dans la suppression de l'eventMatching")
    }

    const contactSendSuccess = []
    //send email à tout les participants
    dataEvent.data.contact.forEach((email) => {
        const mailer = new KlendyxMailer(email)
        const send = mailer.sendValidationMatching(userId, titleEvent, dateEventString, hoursStartString, hoursEndString)
            .then(() => contactSendSuccess.push(send.success))
    })

    return res.json({
        success: true,
        google: eventGoogle.success,
        contactSending: contactSendSuccess
    })
})


export default routerApiMatching