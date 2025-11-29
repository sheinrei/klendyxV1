import { creditTable } from "../../models/creditTable.js";

export async function initCreditUser(db, userId) {
    const Credit = creditTable(db);

    try {
        const init = await Credit.create({
            userId
        })
        if (!init) {
            return { success: false, message: "Erreur lors du process create." }
        }
        return { success: true, message: "Initialisation des crédits validé." }
    } catch (err) {
        console.log("err dans credit", err)
        return { success: false, message: "Erreur lors de l'initialisation des crédits." }
    }


}