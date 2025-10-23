import express from "express";
const routerApiCalendar = express.Router()
import db from "./../sequelize.js";

import { google } from "googleapis";
import { saveToken } from "../service/token/saveToken.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import { getToken } from "../service/token/getToken.js";




// ========= GOOGLE =========
const oauth2Client = new google.auth.OAuth2(
    process.env.O2AUTH_ID_CLIENT,
    process.env.O2AUTH_CLIENT_SECRET,
    `${process.env.HOST}/api/calendar/oauth2callback` // callback URL
);
const scopes = ["https://www.googleapis.com/auth/calendar"];


// 🔹 Étape 1 — Rediriger vers Google pour autorisation
routerApiCalendar.get("/auth/:jwt", (req, res) => {


    const jwtToken = req.params.jwt
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET)
    const userId = payload.userId;


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

    try {
        const token = await getToken("RefreshTokenGoogle", req.userId, db)
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
        console.error("Erreur lors de la récupération des événements :", err);
        res.status(500).send("Erreur lors de la récupération des événements");
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
