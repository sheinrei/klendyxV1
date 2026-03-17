
import tokenTable from "./../../models/tokenTable.js"


export async function updateToken(userId, typeToken, token, db) {

    console.log(`Update d'un token ${typeToken} en cours ...`)

    try {

        const instanceToken = tokenTable(db)
        const update = await instanceToken.update({
            token: JSON.stringify(token)
        }, {
            where: {
                userId,
                type: typeToken
            }
        })

        console.log(update)
        return {
            success: true,
            message: `Token ${typeToken} modifié avec succès pour l'userId ${userId}`,
            update
        }
    } catch (err) {
        console.log("Erreur lors de l'enregistrement token dans la db", err)
    }
}