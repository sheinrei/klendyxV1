import express from "express";
const routerApiUserPreference = express.Router()

import authMiddleware from "../middleware/authMiddleware.js";
import { UserPreference } from "../service/userPreference/ClassUserPreference.js";




routerApiUserPreference.get("/get", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const get = await new UserPreference(userId).getUserPreference();
        return res.json({ success: get.success, message: get.message, data: get.data })

    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support" })
    }

})


routerApiUserPreference.post("/update", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const data = req.body.data
        const updated = await new UserPreference(userId).updateUserPreference(data)
        return res.json({ success: updated.success, message: updated.message })

    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support" })
    }
})


routerApiUserPreference.post("/delete", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const deleted = await new UserPreference(userId).deleteUserPreference()
        return res.json({ success: deleted.success, message: deleted.message })
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support" })
    }
})


export default routerApiUserPreference