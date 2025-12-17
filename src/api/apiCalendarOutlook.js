import express from "express";
const routerApiCalendarOutlook = express.Router()

import db from "./../sequelize.js";

import * as msal from "@azure/msal-node";
import { saveToken } from "../service/token/saveToken.js";
import authMiddleware from "../middleware/authMiddleware.js";


// Config MSAL
const cca = new msal.ConfidentialClientApplication({
    auth: {
        clientId: process.env.OUTLOOK_CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET
    },
})



// ---- 1️⃣ Route OAuth: rediriger l'utilisateur ----
routerApiCalendarOutlook.get("/auth", authMiddleware, async (req, res) => {
    try {
        const authUrl = await cca.getAuthCodeUrl({
            scopes: ["User.Read", "Calendars.ReadWrite"],
            redirectUri: process.env.OUTLOOK_REDIRECT_URI,
            state: JSON.stringify({ userId: req.userId })
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
        await cca.acquireTokenByCode(tokenRequest);
        const msalCache = JSON.parse(cca.getTokenCache().serialize());

        const tokenSaved = {
            accessToken : msalCache.AccessToken,
            refreshToken : msalCache.RefreshToken,
            account : msalCache.Account
        }
        const { state } = req.query;
        const { userId } = JSON.parse(state);

        await saveToken(userId, "OutlookSync", tokenSaved, db);


        return res.redirect(`${process.env.HOST}/index`);

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur OAuth / Graph API");
    }
});






export default routerApiCalendarOutlook