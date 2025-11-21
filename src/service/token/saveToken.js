
import tokenTable from "./../../models/tokenTable.js"


export async function saveToken(userId, typeToken, token, db) {
    const instanceToken = tokenTable(db)
    
    try {
        const save = await instanceToken.create({

            idUser : userId,
            type: typeToken,
            token : JSON.stringify(token)
        })
        return { success : true, message:"Token enregistré dans la base", save}
    } catch (err) {
        console.log("Erreur lors de l'enregistrement token dans la db", err)
    }

}