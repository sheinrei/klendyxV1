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
import { updateEvent } from "./../service/event/updateEvent.js";


// Les routes :

//creation d'un event depuis le formulaire créer un evenement
routerApiEvent.post("/create", authMiddleware, (async (req, res) => {

    const id = req.userId
    //créer l'event de la bdd
    const create = await createEvent(db, req);
    const idEvent = create.create.id;
    if (!create) {
        return res.json({ success: false, message: create.message })
    } else {
        res.json({ success: true, message: create.message })
    }

    const [plateformeEmail, plateformeSms] = req.body.plateformSender;

    if (plateformeEmail) {
        const email = req.body.recipientContactEmail;
        const token = await generateToken(id, "validationEventEmail", db);
        const url = `http://${process.env.HOST}/api/event/valid/${token}/${id}/${idEvent}`;
        const send = sendNewEvent(req, url, email, res)
    }

    //Route a faire pour la gestion par sms
    if (plateformeSms) {
        console.log("set up par sms")
    }
}))



//formulaire d'acceptation du receveur
routerApiEvent.get("/valid/:token/:id/:idEvent", (req, res) => {
    const token = req.params.token;
    const id = req.params.id


    sendFile("/public/pageHtml/formValidEvent.html", res)
})

//api update Event
routerApiEvent.post("/update", async (req, res) => {
    const update = await updateEvent(req, db);

    if (update.success == true) {
        res.json({ success: true, message: update.message })
    }
})

export default routerApiEvent