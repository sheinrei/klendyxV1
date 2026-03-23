import express from "express";
const routerApiContactFav = express.Router()
import authMiddleware from "../middleware/authMiddleware.js";
import { ContactFavoris } from "../service/contactFav/ClassContactFavoris.js";



routerApiContactFav.post("/create", authMiddleware, async (req, res) => {
    try {
        const { nom, prenom, email, phone } = req.body
        const dataDTO = {
            nom,
            prenom,
            email,
            phone
        }
        const created = await new ContactFavoris(req.userId).createContactFav(dataDTO)
        return res
            .status(created.success ? 200 : 400)
            .json({
                success: created.success,
                message: created.message,
                data: created.data
            })
    } catch (err) {
        console.warn(`Echec lors de la création d'un contact favori, error : ${err}`)
        return res.status(500).json({
            success: false,
            message: "Echec lors de la création d'un contact favori",
        })
    }
})


routerApiContactFav.get("/get", authMiddleware, async (req, res) => {
    try {
        const get = await new ContactFavoris(req.userId).getAllContactFav()
        return res
            .status(200)
            .json({
                success: true,
                message: get.message,
                data: get.data
            })
    } catch (err) {
        console.warn(`Erreur lors récupération des contact favori, error : ${err}`)
        return res.status(500).json({
            success: false,
            message: "Erreur lors drécupération des contact favori",
        })
    }
})


routerApiContactFav.post("/delete", authMiddleware, async (req, res) => {

    const deleted = await new ContactFavoris(req.userId).deleteContactFav(req.body.id);
    console.log(deleted)
    return res
        .status(deleted.success ? 200 : 400)
        .json({
            success: deleted.success,
            message: deleted.message,
            data: deleted.data || []
        })
})


routerApiContactFav.post("/search", authMiddleware, async (req, res) => {
    try {
        const item = await new ContactFavoris(req.userId).getDynamicContactFav(req.body.searching)
        console.log(item.data)
        return res.json({ data: item.data })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Une erreur est survenue avec le serveur et nous n'avons pas pu traitder votre demande."
        })
    }
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

        const updated = await new ContactFavoris(req.userId).updateContactFav(dataDTO)
        console.log(updated)
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