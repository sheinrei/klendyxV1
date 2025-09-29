import crypto from "crypto"
import tableToken from "./../models/token.js"

export default async function generateToken(userId, typeToken, db) {

    const instanceToken = tableToken(db)
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