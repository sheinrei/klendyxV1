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
    "http://localhost:3000/api/calendar/oauth2callback" // callback URL
);
const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];


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


        res.send("Connexion réussie ! Tu peux fermer cette fenêtre.");
    } catch (err) {
        console.error("Erreur lors du callback:", err);
        res.status(500).send("Erreur d’authentification");
    }
});



// 🔹 Étape 3 — Exemple d’accès au calendrier
routerApiCalendar.get("/get", authMiddleware, async (req, res) => {


    try {
        const token = await getToken("RefreshTokenGoogle", req.userId, db);
        console.log(token)
        if (!token) return res.status(401).send("Non autorisé");

        oauth2Client.setCredentials(token);

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 2500,
            singleEvents: true,
            orderBy: "startTime",
        });

        res.json({ success: true, events })
    } catch (err) {
        console.error("Erreur lors de la récupération des événements :", err);
        res.status(500).send("Erreur lors de la récupération des événements");
    }
});












export default routerApiCalendar;
