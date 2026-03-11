
import tokenTable from "./../../models/tokenTable.js"


export async function saveToken(userId, typeToken, token, db) {
    console.log("Sauvegarde d'un token en cours")
    const instanceToken = tokenTable(db)
    try {
        const save = await instanceToken.create({
            userId: userId,
            type: typeToken,
            token: JSON.stringify(token)
        })
        return {
            success: true,
            message: "Token enregistré dans la base",
            save
        }
    } catch (err) {
        console.log("Erreur lors de l'enregistrement token dans la db", err)
    }
}