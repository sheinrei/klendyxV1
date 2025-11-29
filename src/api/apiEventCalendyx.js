import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
const routerApiEventCalendyx = express.Router()

routerApiEventCalendyx.post("/create", authMiddleware, async (req, res) => {



    res.json({ success: true, message: "Evenement Calendyx créé" })
})


export default routerApiEventCalendyx