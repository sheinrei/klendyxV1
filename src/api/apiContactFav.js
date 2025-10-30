import express from "express";
const routerApiContactFav = express.Router()

import db from "./../sequelize.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createContactFav } from "../service/contactFav/createContactFav.js";
import { getContactFav, getDynamicContactFav } from "../service/contactFav/getContactFav.js";
import { updateContactFav } from "../service/contactFav/updateContactFav.js";
import { deleteContactFav } from "../service/contactFav/deleteContactFav.js";




routerApiContactFav.post("/create", authMiddleware, async (req, res) => {
    const create = await createContactFav(db, req);
    if (!create.success) {
        return res.json({ success: false, message: create.message })
    }
    return res.json({ success: true, message: create.message, data: create.data })
})


routerApiContactFav.get("/get", authMiddleware, async (req, res) => {
    const get = await getContactFav(db, req);
    if (!get.success) {
        return res.json({ success: false, message: get.message })
    }
    return res.json({ success: true, message: get.message, data: get.getContact })
})


routerApiContactFav.post("/delete", authMiddleware, async (req, res) => {
    const deleted = await deleteContactFav(db, req);

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
    const updated = await updateContactFav(db, req);

    return res.json({ success: updated.success, message:updated.message})

})

export default routerApiContactFav