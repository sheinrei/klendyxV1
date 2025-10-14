import express from "express";
import { google } from "googleapis";

const routerApiCalendar = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.O2AUTH_ID_CLIENT,
    process.env.O2AUTH_CLIENT_SECRET,
    "http://localhost:3000/api/calendar/oauth2callback" // callback URL
);
const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];





// 🔹 Étape 1 — Rediriger vers Google pour autorisation
routerApiCalendar.get("/auth", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent", // utile en dev pour forcer le refresh_token
    });

    console.log("Autorise l’app en visitant :", authUrl);
    res.redirect(authUrl);
});





// 🔹 Étape 2 — Callback après autorisation
routerApiCalendar.get("/oauth2callback", async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log("Tokens récupérés :", tokens);

        // exemple: stocker en mémoire ou DB
        req.app.locals.tokens = tokens;

        res.send("Connexion réussie ! Tu peux fermer cette fenêtre.");
    } catch (err) {
        console.error("Erreur lors du callback:", err);
        res.status(500).send("Erreur d’authentification");
    }
});





// 🔹 Étape 3 — Exemple d’accès au calendrier
routerApiCalendar.get("/", async (req, res) => {
    try {
        if (!req.app.locals.tokens) {
            return res.status(401).send("Non autorisé. Fais d’abord /auth.");
        }

        oauth2Client.setCredentials(req.app.locals.tokens);

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });

        res.json(events.data.items);
    } catch (err) {
        console.error("Erreur lors de la récupération des événements :", err);
        res.status(500).send("Erreur lors de la récupération des événements");
    }
});

export default routerApiCalendar;
