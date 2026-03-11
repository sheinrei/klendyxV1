import express from "express";
const routerApiRdv = express.Router()

//securité
import authMiddleware from "../middleware/authMiddleware.js";

//instance bdd
import db from "../sequelize.js";


import { createKlendyxPropositionRdv } from "../service/event/createKlendyxPropositionRdv.js";
import generateToken from "../service/token/generateToken.js";
import { updatePropositionRdv, updateStateEvent } from "../service/event/updatePropositionRdv.js";
import { getAllPropositionRdv, getPropositionRdvById } from "../service/event/getPropositionRdv.js";
import { decrementCredit } from "../service/credit/decrementCredit.js";
import { deleteEvent } from "../service/event/deleteEvent.js";
import { getUserData } from "../service/user/getUserData.js";


import { SmsSender } from "../service/sms/smsSender.js";

import { KlendyxMailer } from "../service/mailer/ClassMailer.js";
import { createRappelRdv } from "../service/rappelRdv/createRappelRdv.js";



//Envois de rendez-vous
routerApiRdv.post('/sending', authMiddleware, async (req, res) => {
    const { methodRdvProposition, methodRdvConfirmation,
        nom, prenom,
        email, phone,
        dayStart, hourStart, hourEnd,
        title, commentaire,
        methodContactSms, methodContactEmail,
        rappel,
        rappelSms, rappelEmail,
        timeRappel } = req.body;


    const userId = req.userId
    const dataUser = await getUserData(db, userId);
    const nameInitialisateur = dataUser.nom + " " + dataUser.prenom;
    let dataReturn = {}

    //rempli la bdd rappel de rdv
    if (rappel) {
        let method = ""
        if (rappelSms) method += "sms"
        if (rappelSms && rappelEmail) method += "-"
        if (rappelEmail) method += "email"
        const date = new Date(`${dayStart.replace(":", "-")}T${hourStart}`)
        const dayStartFr = date.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })
        const message = `Bonjour ${prenom}, rappel de votre rendez-vous avec ${nameInitialisateur} le ${dayStartFr} de ${hourStart.replace(":", "h")} à ${hourEnd.replace(":", "h")}`

        const createRappel = await createRappelRdv(db, userId, phone, email, method, date, timeRappel, message)

        if (createRappel.success && rappelEmail) {
            decrementCredit(db, req, "mail")
        }
        if (createRappel.success && rappelSms) {
            decrementCredit(db, req, "sms")
        }
        dataReturn["rappel"] = {
            success: createRappel.success,
            message: createRappel.message
        }
    }


    if (methodRdvConfirmation) {
        if (methodContactSms) {
            try {
                const message = `Bonjour, votre rendez-vous "${title}" avec ${nameInitialisateur} est confirme le ${dayStart} de ${hourStart.replace(":", "h")} a ${hourEnd.replace(":", "h")}`;
                const Sender = new SmsSender(phone, message)
                const sendSms = await Sender.sendSms()
                console.log(sendSms)
                dataReturn["sms"] = {
                    success: sendSms.success,
                    message: sendSms.message
                }
                if (sendSms.success) {
                    await decrementCredit(db, req, "sms")
                }
            } catch (err) {
                console.log(err)
                dataReturn["sms"] = {
                    success: false,
                    message: err
                }
            }
        }
        if (methodContactEmail) {
            try {
                const mailer = new KlendyxMailer(email)
                const sendEmail = await mailer.sendConfirmationRdv(title, commentaire, prenom, nameInitialisateur, dayStart, hourStart, hourEnd);
                dataReturn["email"] = {
                    success: sendEmail.success,
                    message: sendEmail.message
                }
                if (sendEmail.success) {
                    await decrementCredit(db, req, "mail")
                }

            } catch (err) {
                console.log(err)
                dataReturn["email"] = {
                    success: false,
                    message: err
                }
            }
        }
    }

    if (methodRdvProposition) {
        const createProposition = await createKlendyxPropositionRdv(db, req);
        const token = await generateToken(userId, "validationEventEmail", db);
        const url = `${process.env.HOST}/valider-rdv/${token.token}/${userId}/${createProposition.create.id}`;

        if (methodContactEmail) {
            try {
                const mailer = new KlendyxMailer(email)
                const send = await mailer.sendPropositionRdv(url, prenom, nameInitialisateur, title, commentaire, dayStart, hourStart, hourEnd);
                dataReturn["email"] = {
                    success: send.success,
                    message: send.message
                }
                if (send.success) {
                    await decrementCredit(db, req, "mail")
                }
            } catch (err) {
                console.log(err)
                dataReturn["email"] = {
                    success: false,
                    message: err
                }
            }
        }

        if (methodContactSms) {
            const textSms = `Bonjour,
                ${nameInitialisateur} vous propose un rendez-vous "${title}"
                le ${dayStart} de ${hourStart} a ${hourEnd}.
                Merci de repondre en cliquant sur ce lien ${url}
                `

            try {

                const sender = new SmsSender(phone, textSms)
                const result = await sender.sendSms()

                console.log(result)
                dataReturn["sms"] = {
                    success: result.success,
                    message: result.message
                }
                if (send.success) {
                    await decrementCredit(db, req, "sms")
                }

            } catch (err) {
                dataReturn["sms"] = {
                    success: false,
                    message: err
                }
            }
        }
    }

    return res.json({ success: true, data: dataReturn })
})




//mis à jour de la réponse d'une proposition de rendez-vous
routerApiRdv.post("/reponsePropositionRdv", async (req, res) => {

    const searchProposition = await getPropositionRdvById(db, req)
    if (!searchProposition.success) {
        return res.json({ success: false, message: searchProposition.message })
    }
    if (searchProposition.data.recipientReponse !== null) {
        return res.json({ success: false, message: "Une réponse pour cet événement a déjà été renseigné, impossible de le changer" })
    }

    const update = await updatePropositionRdv(req, db);


    if (update.success == true) {
        const dataUser = await getUserData(req, db, req.body.id);
        const email = dataUser.email;
        const nameInitialisateur = `${dataUser.nom} ${dataUser.prenom}`;
        const recipientPropositionFullName = searchProposition.data.recipientName;
        const mailer = new KlendyxMailer(email)
        const sending = await mailer.sendResolvPropositionRdv(req, nameInitialisateur, recipientPropositionFullName)
        return res.json({ success: sending.success, message: sending.message })
    }
})


//get tout les events de l'user
routerApiRdv.get("/get", authMiddleware, async (req, res) => {
    const event = await getAllPropositionRdv(db, req);

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