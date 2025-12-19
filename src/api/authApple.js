import express from "express";
const routerAuthCalendarApple = express.Router()
//import db from "./../sequelize.js";
import authMiddleware from "../middleware/authMiddleware.js";




import { createAccount } from "dav";


routerAuthCalendarApple.post("/auth", authMiddleware, async (req, res) => {
    const { email, appPassword } = req.body;

    console.log("debut de la route apple")
    if (!email || !appPassword) {
        return res.status(400).json({ error: "email et appPassword requis" });
    }

    try {
        const account = await createAccount({
            server: "https://caldav.icloud.com",
            credentials: {
                username: email,
                password: appPassword
            },
            loadCollections: true,
            loadObjects: false
        });

        const calendars = account.calendars.map(cal => ({
            name: cal.displayName,
            url: cal.url,
            ctag: cal.ctag
        }));

        res.json({
            principalUrl: account.principalUrl,
            calendarHomeUrl: account.calendarHomeUrl,
            calendars
        });

    } catch (err) {
        res.status(401).json({
            error: "Connexion Apple Calendar impossible",
            details: err.message
        });
    }
})


export default routerAuthCalendarApple