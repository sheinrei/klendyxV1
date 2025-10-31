import express from "express";
const routerApiCalendar = express.Router()
import db from "./../sequelize.js";

import { google } from "googleapis";
import { saveToken } from "../service/token/saveToken.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { getToken } from "../service/token/getToken.js";
import { deleteToken } from "../service/token/deleteToken.js";




// ========= GOOGLE =========
const oauth2Client = new google.auth.OAuth2(
    process.env.O2AUTH_ID_CLIENT,
    process.env.O2AUTH_CLIENT_SECRET,
    `${process.env.HOST}/api/calendar/oauth2callback` // callback URL
);
const scopes = ["https://www.googleapis.com/auth/calendar"];


// 🔹 Étape 1 — Rediriger vers Google pour autorisation
routerApiCalendar.get("/auth",authMiddleware, (req, res) => {

    const userId = req.userId;


    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent", // utile en dev pour forcer le refresh_token
        state: JSON.stringify({ userId })
    });

    console.log("Autorise l’app en visitant :", authUrl);
    res.redirect(authUrl);
});



// 🔹 Étape 2 — Callback après autorisation
routerApiCalendar.get("/oauth2callback", async (req, res) => {

    const { code, state } = req.query;
    const { userId } = JSON.parse(state);

    try {
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        saveToken(userId, "RefreshTokenGoogle", tokens, db)


        res.redirect(`${process.env.HOST}/agenda`);
    } catch (err) {
        console.error("Erreur lors du callback:", err);
        res.status(500).send("Erreur d’authentification");
    }
});



// 🔹 Étape 3 — Exemple d’accès au calendrier
routerApiCalendar.get("/google/get", authMiddleware, async (req, res) => {
    let token = await getToken("RefreshTokenGoogle", req.userId, db)

    try {
        if (!token) return res.status(401).send("Non autorisé")

        oauth2Client.setCredentials(token)

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const now = new Date();
        const lastMounth = new Date(now);
        lastMounth.setDate(now.getDate() - 30);

        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: lastMounth.toISOString(),
            fields: "items(id,summary,start,end, description)",
            maxResults: 400,
            singleEvents: true,
            orderBy: "startTime",
        });

        res.json({ success: true, events })

    } catch (err) {
        if(err == "Error: No access, refresh token, API key or refresh handler callback is set."){
            return res.json({success: false, message : "Vous n'avez pas acces à votre agenda google, merci de vous authentifier"})
        }
        if (err.response.data.error_description === 'Token has been expired or revoked.') {
            await deleteToken(token, db)
            return res.json({ success: false, err: "droit acces", message: `Vos droits d'accès à votre agenda Google ont été modifié, merci de resynchroniser votre agenda Google en cliquant` })
        }
        res.json({ success: false, message: err });
    }
});


//create un event google
routerApiCalendar.post("/google/create", authMiddleware, async (req, res) => {

    const token = await getToken("RefreshTokenGoogle", req.userId, db);
    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
        summary: req.body.summary,
        location: 'Google Meet',
        description: req.body.description,
        start: {
            dateTime: req.body.dateStart,
            timeZone: 'Europe/Paris',
        },
        end: {
            dateTime: req.body.dateEnd,
            timeZone: 'Europe/Paris',
        },
    };

    let repeat = req.body.repeat || false
    const recurence = [
        `RRULE:FREQ=WEEKLY;INTERVAL=X;COUNT=X;UNTIL=20110701T170000Z;BYDAY=X`,
    ]
    if (repeat) {
        event.push(recurence)
    }

    calendar.events.insert({
        calendarId: 'primary',
        resource: event,
    }, (err, eventRes) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }
        const googleEventId = eventRes.data.id;
        res.json({ success: true, data: eventRes.data, id: googleEventId });
    });
})


//udate un event google
routerApiCalendar.post("/google/update", async (req, res) => {

    const token = await getToken("RefreshTokenGoogle", req.userId, db);
    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    calendar.events.update({
        calendarId: 'primary',
        eventId: 'ID_DE_L_EVENT',
        resource: { summary: 'Titre modifié' },
    });
})


//supprimer un event google
routerApiCalendar.post("/google/delete", authMiddleware, async (req, res) => {

    const eventId = req.body.eventId

    const token = await getToken("RefreshTokenGoogle", req.userId, db);
    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
        const deleted = await calendar.events.delete({
            calendarId: 'primary',
            eventId,
        });

        if (deleted) {
            res.json({ success: true, message: "Evenement effacé de votre agenda" })
        }

    } catch (err) {
        console.log(err)
    }

})





export default routerApiCalendar;
