import express from "express"
const routerApiCredit = express.Router()

//instance bdd
import db from "./../sequelize.js";
//securité
import authMiddleware from "./../middleware/authMiddleware.js";
import { getCredit } from "../service/credit/getCredit.js"



routerApiCredit.get("/get", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const data = await getCredit(db, userId)
    if (data) {
        res.json({ success: true, data })
    }
})

export default routerApiCredit