import express from "express";
const routerApiContactFav = express.Router()

import db from "./../sequelize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createContactFav } from "../service/contactFav/createContactFav.js";
import { getAllContactFav, getDynamicContactFav } from "../service/contactFav/getContactFav.js";
import { updateContactFav } from "../service/contactFav/updateContactFav.js";
import { deleteContactFav } from "../service/contactFav/deleteContactFav.js";




routerApiContactFav.post("/create", authMiddleware, async (req, res) => {
    try {
        const { nom, prenom, email, phone } = req.body
        const dataDTO = {
            userId: req.userId,
            nom,
            prenom,
            email,
            phone
        }
        const created = await createContactFav(db, dataDTO);
        return res
            .status(created.success ? 200 : 400)
            .json({
                success: created.success,
                message: created.message
            })
    } catch (err) {
        console.warn(`Echec lors de la création d'un contact favori, error : ${err}`)
        return res.status(500).json({
            success: false,
            message: "Echec lors de la création d'un contact favori",
            error: err
        })
    }
})


routerApiContactFav.get("/get", authMiddleware, async (req, res) => {
    try {
        const userId = res.userId
        const get = await getAllContactFav(db, userId);
        if (!get.success) {
            return res.status(400).json({ success: false, message: get.message })
        }
        return res
            .status(200)
            .json({
                success: true,
                message: get.message,
                data: get.getContact
            })
    } catch (err) {
        console.warn(`Erreur lors récupération des contact favori, error : ${err}`)
        return res.status(500).json({
            success: false,
            message: "Erreur lors drécupération des contact favori",
            error: err
        })
    }
})


routerApiContactFav.post("/delete", authMiddleware, async (req, res) => {

    const deleted = await deleteContactFav(db, req.body.id);

    if (deleted.success) {
        return res.json({ success: true, message: deleted.message })
    }
    return res.json({ success: false, message: deleted.message })
})


routerApiContactFav.post("/search", authMiddleware, async (req, res) => {

    const item = await getDynamicContactFav(db, req)

    return res.json({ data: item.getContact })
})


routerApiContactFav.post("/update", authMiddleware, async (req, res) => {

    try {
        const dataDTO = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            phone: req.body.phone,
            id: req.body.id
        }

        const updated = await updateContactFav(db, dataDTO);

        return res
            .status(updated.success ? 200 : 400)
            .json({
                success: updated.success,
                message: updated.message
            })
    } catch (err) {
        console.warn(`Erreur lors de la mise a jour d'un contact favori, error : ${err}`)
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la mise a jour d'un contact favori.",
            error: err
        })
    }

})

export default routerApiContactFav