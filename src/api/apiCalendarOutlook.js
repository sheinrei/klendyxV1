import express from "express";
const routerApiCalendarOutlook = express.Router()

//import db from "./../sequelize.js";

import * as msal from "@azure/msal-node";

// Config MSAL
const cca = new msal.ConfidentialClientApplication({
    auth: {
        clientId: process.env.OUTLOOK_CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET
    }
});



// ---- 1️⃣ Route OAuth: rediriger l'utilisateur ----
routerApiCalendarOutlook.get("/auth", async (req, res) => {
    try {
        const authUrl = await cca.getAuthCodeUrl({
            scopes: ["User.Read", "Calendars.ReadWrite"],
            redirectUri: process.env.OUTLOOK_REDIRECT_URI
        });
        res.redirect(authUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur génération URL OAuth");
    }
});

// ---- 2️⃣ Callback OAuth ----
routerApiCalendarOutlook.get("/callback", async (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["User.Read", "Calendars.ReadWrite"],
        redirectUri: process.env.OUTLOOK_REDIRECT_URI
    };

    try {
        const response = await cca.acquireTokenByCode(tokenRequest);
        const accessToken = response.accessToken;

        // Lire les events avec fetch
        const eventsResp = await fetch("https://graph.microsoft.com/v1.0/me/events", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const eventsData = await eventsResp.json();

        res.json({
            message: "Connexion Outlook réussie ✅",
            events: eventsData.value,
            accessToken // utile pour tester la création d'event
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur OAuth / Graph API");
    }
});






// ---- 3️⃣ Créer un event simple ----
routerApiCalendarOutlook.post("/create-event", async (req, res) => {
    const { accessToken, subject, startDateTime, endDateTime } = req.body;
    if (!accessToken || !subject || !startDateTime || !endDateTime) {
        return res.status(400).send("Paramètres manquants");
    }

    const event = {
        subject,
        start: { dateTime: startDateTime, timeZone: "UTC" },
        end: { dateTime: endDateTime, timeZone: "UTC" }
    };

    try {
        const createResp = await fetch("https://graph.microsoft.com/v1.0/me/events", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event)
        });

        const createData = await createResp.json();
        res.json({ message: "Event créé ✅", event: createData });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur création event");
    }
});





export default routerApiCalendarOutlook