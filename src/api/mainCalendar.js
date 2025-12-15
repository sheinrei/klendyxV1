import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const routerApiMainCalendar = express.Router()

//import db from "./../sequelize.js";



































routerApiMainCalendar.post("/get", authMiddleware, (req, res) => {


    const data = req.body;
    return res.json({ success: true, data })

})



export default routerApiMainCalendar