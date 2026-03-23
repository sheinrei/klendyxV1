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
import { deletePropositionRdv } from "../service/event/deletePropositionRdv.js";
import { getUserData } from "../service/user/getUserData.js";

import { Credit } from "../service/credit/ClassCredit.js";

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

    const CreditInstance = new Credit(userId)

    //rempli la bdd rappel de rdv
    if (rappel) {
        let method = ""
        if (rappelSms) method += "sms"
        if (rappelSms && rappelEmail) method += "-"
        if (rappelEmail) method += "email"
        const date = new Date(`${dayStart.replace(":", "-")}T${hourStart}Z`)

        //creation du rappel de rendez-vous dans la table
        const createRappel = await createRappelRdv(db, userId, phone, email, method, date, timeRappel, hourStart, hourEnd, nom, prenom)
        if (createRappel.success && rappelEmail) {
            await CreditInstance.decrementCredit("email")
        }
        if (createRappel.success && rappelSms) {
            await CreditInstance.decrementCredit("sms")
        }
        dataReturn["rappel"] = {
            success: createRappel.success,
            message: createRappel.message
        }
    }


    if (methodRdvConfirmation) {
        if (methodContactSms) {
            try {
                const message = `Bonjour, votre rendez-vous "${title}" avec ${nameInitialisateur} est confirme le ${new Date(dayStart).toLocaleDateString("FR-fr", { day: "numeric", month: "long" })} de ${hourStart.replace(":", "h")} a ${hourEnd.replace(":", "h")}`;
                const Sender = new SmsSender(phone, message)
                const sendSms = await Sender.sendSms()
                console.log(sendSms)
                dataReturn["sms"] = {
                    success: sendSms.success,
                    message: sendSms.message
                }
                if (sendSms.success) {
                    await CreditInstance.decrementCredit("sms")
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
                    await CreditInstance.decrementCredit("email")
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

    //PROPOSITION DE RENDEZ-VOUS
    if (methodRdvProposition) {
        const createProposition = await createKlendyxPropositionRdv(db, req);
        const token = await generateToken(userId, "validationEventEmail", db);
        const url = `${process.env.HOST}/valider-rdv/${token.token}/${userId}/${createProposition.create.id}`;

        if (methodContactEmail) {
            try {
                const mailer = new KlendyxMailer(email)
                const send = await mailer.sendPropositionRdv(url, nom, prenom, nameInitialisateur, title, commentaire, dayStart, hourStart, hourEnd);
                dataReturn["email"] = {
                    success: send.success,
                    message: send.message
                }
                if (send.success) {
                    await CreditInstance.decrementCredit("email")
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
                    await CreditInstance.decrementCredit("sms")
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

    try {
        const searchProposition = await getPropositionRdvById(db, req)
        if (!searchProposition.success) {
            return res.json({ success: false, message: searchProposition.message })
        }
        if (searchProposition.data.recipientReponse !== null) {
            return res.json({ success: false, message: "Une réponse pour cet événement a déjà été renseigné, impossible de le changer" })
        }

        const update = await updatePropositionRdv(req, db);


        if (update.success == true) {
            const dataUser = await getUserData(db, req.body.id);
            const email = dataUser.email;
            const nameInitialisateur = `${dataUser.nom} ${dataUser.prenom}`;
            const recipientPropositionFullName = searchProposition.data.recipientName;
            const mailer = new KlendyxMailer(email)
            await mailer.sendResolvPropositionRdv(req, nameInitialisateur, recipientPropositionFullName)
        }

        console.log("update d'une réponse proposition", update)
        return res.status(200).json({
            success: update.success,
            message: update.message
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Une erreur avec le serveur est survenue, impossible de mettre à jour la proposition de rendez-vous.",
            error: err
        })
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
routerApiRdv.delete("/:idEvent", authMiddleware, async (req, res) => {

    try {
        const userId = req.userId;
        const idEvent = req.params.idEvent;

        console.log("Proposition à supprimer : ", idEvent)
        const deleted = await deletePropositionRdv(db, userId, idEvent)
        return res
            .status(deleted.success ? 200 : 400)
            .json({
                success: deleted.success,
                message: deleted.message
            })

    } catch (err) {
        console.error(`Erreur survenue lors de la suppression d'une proposition de rendez-vous, error : ${err}`)
        return res
            .status(500)
            .json({
                success: false,
                message: "Erreur survenue lors de la suppression d'une proposition de rendez-vous."
            })

    }

})

routerApiRdv.put("/:methodContactSms/:methodContactEmail/:recipientPhone/:recipientEmail/:recipientName/:title/:dayStart/:hourStart/:hourEnd",
    authMiddleware, async (req, res) => {

        const {
            methodContactSms,
            methodContactEmail,
            recipientPhone,
            recipientEmail,
            recipientName,
            title,
            dayStart,
            hourStart,
            hourEnd
        } = req.params


        console.log({
            methodContactSms,
            methodContactEmail,
            recipientPhone,
            recipientEmail,
            recipientName,
            title,
            dayStart,
            hourStart,
            hourEnd
        })
    }
)


export default routerApiRdv