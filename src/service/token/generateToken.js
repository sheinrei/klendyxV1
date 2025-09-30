import crypto from "crypto"
import tokenTable from "./../../models/tokenTable.js"

export default async function generateToken(userId, typeToken, db) {

    const instanceToken = tokenTable(db)
    const token = crypto.randomBytes(32).toString("hex")

    try {
        await instanceToken.create({
            idUser: userId,
            type: typeToken,
            token,
        })
        return token

    } catch (err) {
        console.log(err)
        return ("Erreur lors de la création du token", err)
    }
}