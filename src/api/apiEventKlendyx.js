import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { createEventKlendyx } from "../service/eventKlendyx/createEventKlendyx.js"
import db from "../sequelize.js";


const routerApiEventKlendyx = express.Router()

routerApiEventKlendyx.post("/create", authMiddleware, async (req, res) => {

    const created = await createEventKlendyx(db, req)
    if(!created.success){
        return res.json({success:false, message: created.message})
    }

    return res.json({ success: true, message: created.message })
})


export default routerApiEventKlendyx