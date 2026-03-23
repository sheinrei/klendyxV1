import express from "express"
const routerApiCredit = express.Router()

import authMiddleware from "./../middleware/authMiddleware.js";
import { Credit } from "../service/credit/ClassCredit.js";


routerApiCredit.get("/get", authMiddleware, async (req, res) => {
    try {
        const data = await new Credit(req.userId).getCredit()
        return res
            .status(data.success ? 200 : 400)
            .json({
                success:data.success,
                message : data.message,
                data: data.data
            })
    } catch (err) {
        return res.status(500).json({
            success:false,
            message : "Une erreur avec le serveur est survenu lors de la récupération des crédits."
        })
    }
})



export default routerApiCredit