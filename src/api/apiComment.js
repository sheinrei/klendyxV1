import express from "express";
const routerApiComment = express.Router()

import db from "./../sequelize.js";
import { createComment } from "../service/commentaire/createComment.js";




routerApiComment.post("/post", async (req, res) => {

    const comment = await createComment(req, db)

    if (comment.success) {
        return res.json({ success: true, message: comment.message })
    }
    return res.json({ sucess: false, message: "Erreur survenu avec le serveur impossible de deposer votre commentaire, veuillez réessayer plus tard" })
})


export default routerApiComment