import express from "express";
const routerApiCalendar = express.Router()
import db from "./../sequelize.js";

import { google } from "googleapis";
import { saveToken } from "../service/token/saveToken.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getToken } from "../service/token/getToken.js";
import { deleteTokenAccessGoogle } from "../service/token/deleteToken.js";




// ========= GOOGLE =========
const oauth2Client = new google.auth.OAuth2(
    process.env.O2AUTH_ID_CLIENT,
    process.env.O2AUTH_CLIENT_SECRET,
    `${process.env.HOST}/api/calendar/oauth2callback` // callback URL
);
const scopes = ["https://www.googleapis.com/auth/calendar"];


// 🔹 Étape 1 — Rediriger vers Google pour autorisation
routerApiCalendar.get("/auth", authMiddleware, (req, res) => {
    const userId = req.userId;
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent", // utile en dev pour forcer le refresh_token
        state: JSON.stringify({ userId })
    });
    res.redirect(authUrl);
});



// 🔹 Étape 2 — Callback après autorisation
routerApiCalendar.get("/oauth2callback", async (req, res) => {
    const { code, state } = req.query;
    const { invite } = JSON.parse(state);
    const { tokens } = await oauth2Client.getToken(code);

    try {

        if (!invite) {
            const { userId } = JSON.parse(state);
            oauth2Client.setCredentials(tokens);
            saveToken(userId, "RefreshTokenGoogle", tokens, db)
        }
        if(invite){
            res.cookie("googleAuth", tokens.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600 * 1000
            })
        }
        res.redirect(`${process.env.HOST}/agenda`);
        
    } catch (err) {
        console.error("Erreur lors du callback:", err);
        res.status(500).send("Erreur d’authentification");
    }
});



// 🔹 Étape 3 — Get all calendar
routerApiCalendar.get("/google/get", authMiddleware, async (req, res) => {

    let token = await getToken("RefreshTokenGoogle", req.userId, db)
    const { rangeMin, rangeMax } = req.query

    try {
        if (!token) return res.status(401).send("Non autorisé")

        oauth2Client.setCredentials(token)

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const now = new Date();
        const lastMounth = new Date(now);
        lastMounth.setDate(now.getDate() - 30);

        const option = {
            calendarId: "primary",
            timeMin: rangeMin ? new Date(rangeMin).toISOString() : lastMounth.toISOString(),
            timeMax: rangeMax ? new Date(rangeMax).toISOString() : undefined,
            fields: "items(id,summary,start,end, description)",
            maxResults: 400,
            singleEvents: true,
            orderBy: "startTime",
        }

        const events = await calendar.events.list(option);
        res.json({ success: true, events })

    } catch (err) {
        const errorDesc = err?.response?.data?.error_description;
        const errorCode = err?.response?.data?.error;
        const tokenExpire = err?.message
        console.log(tokenExpire)
        if (
            errorDesc === "Token has been expired or revoked." ||
            errorCode === "invalid_grant" ||
            err?.message?.includes("invalid_grant") ||
            tokenExpire?.includes('No access, refresh token, API key or refresh handler callback is set.')
        ) {
            console.log("Suppression du token dans le BDD")
            await deleteTokenAccessGoogle(req.userId, db); // supprime token invalide
            return res.json({
                success: false,
                err: "droit acces",
                message: `Vos droits d'accès à votre agenda Google ont été modifiés, merci de resynchroniser votre agenda Google.`
            });
        }

        return res.json({
            success: false,
            message: err?.message || "Erreur interne"
        });
    }
});

//Cherche si un user est sync
routerApiCalendar.get("/google/sync", authMiddleware, async (req, res) => {
    const user = req.userId

    const searchToken = await getToken("RefreshTokenGoogle", user, db)

    return res.json(searchToken.success)
})


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









//Section get en mode invite (non connecté)

//redirect invite
routerApiCalendar.get("/google/auth/invite", (req, res) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.O2AUTH_ID_CLIENT,
        process.env.O2AUTH_CLIENT_SECRET,
        `${process.env.HOST}/api/calendar/oauth2callback` // callback URL
    );
    const scope = "https://www.googleapis.com/auth/calendar.readonly"

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scope,
        prompt: "consent", // utile en dev pour forcer le refresh_token
        state: JSON.stringify({ invite: true })
    });
    res.redirect(authUrl);

})


//get en mode invite
routerApiCalendar.get("/google/get/invite", async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.O2AUTH_ID_CLIENT,
            process.env.O2AUTH_CLIENT_SECRET
        );

        const cookieTokenGoogle = req.cookies.googleAuth;
        const { rangeMin, rangeMax, userId } = req.query;

        let tokenStore = null;

        // Si pas de cookie, récupère token dans la BDD
        if (!cookieTokenGoogle) {
            tokenStore = await getToken("RefreshTokenGoogle", userId, db);
            if (!tokenStore) return res.status(401).send("Non autorisé");
        }

        // Choisis le refresh_token à utiliser
        const refreshToken = cookieTokenGoogle ?? tokenStore.refresh_token;

        if (!refreshToken) return res.status(401).send("Non autorisé");

        oauth2Client.setCredentials({ refresh_token: refreshToken });

        // Rafraîchit l'access token si pas de cookie et tokenStore expiré
        if (!cookieTokenGoogle && (!tokenStore.access_token || Date.now() >= tokenStore.expiry_date)) {
            console.log("🔄 Refresh Google access token...");
            const accessTokenResponse = await oauth2Client.getAccessToken();
            tokenStore.access_token = accessTokenResponse.token;
            tokenStore.expiry_date = Date.now() + 3600 * 1000; // 1h typique
            console.log("✅ Google token refreshed.");
            // Ici tu peux sauvegarder tokenStore en BDD
        }

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const options = {
            calendarId: "primary",
            timeMin: rangeMin,
            timeMax: rangeMax,
            fields: "items(id,summary,start,end,description)",
            maxResults: 400,
            singleEvents: true,
            orderBy: "startTime",
        };

        const events = await calendar.events.list(options);

        if (cookieTokenGoogle) {
            res.clearCookie("googleAuth", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })
        }
        res.json({ success: true, events });

    } catch (err) {
        console.error(err);
        if (err.message?.includes("No access, refresh token, API key or refresh handler callback")) {
            return res.json({ success: false, message: "Vous n'avez pas acces à votre agenda Google, merci de vous authentifier" });
        }
        if (err.response?.data?.error_description === 'Token has been expired or revoked.') {
            // Optionnel : supprimer le token en BDD
            // await deleteToken(tokenStore)
            return res.json({
                success: false,
                err: "droit acces",
                message: `Vos droits d'accès à votre agenda Google ont été modifié, merci de resynchroniser votre agenda Google en cliquant`
            });
        }
        res.json({ success: false, message: err.message || err });
    }
});

export default routerApiCalendar;
