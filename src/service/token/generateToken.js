import crypto from "crypto"
import tokenTable from "./../../models/tokenTable.js"

export default async function generateToken(userId, typeToken, db) {

    const instanceToken = tokenTable(db)
    const token = crypto.randomBytes(32).toString("hex")

    try {
        const newToken = await instanceToken.create({
            idUser: userId,
            type: typeToken,
            token,
        })
        if (newToken) {
            return ({ success: true, token })
        }

        return({ success: false, message : "Echec lors de la création du token" })

    } catch (err) {
        console.log(err)
        return ({success:false, message : "Erreur lors de la création du token", err})
    }
}

