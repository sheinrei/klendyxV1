import tableToken from "./../../models/tokenTable.js"
import tableUser from "./../../models/utilisateurTable.js";
import { initCreditUser } from "../credit/initCreditUser.js";

export default async function verifyAccount(token, id, db) {

    const idUser = id
    const TableToken = tableToken(db)
    const TableUser = tableUser(db)

    const storedToken = await TableToken.findOne({ where: { idUser: id } })
    
    if (storedToken?.token !== token || !storedToken) {
        return ({ success: false, message: "Echec lors de la validation de votre compte" })
    } else {
        await TableUser.update(
            { isVerified: Boolean(true) },
            { where: { id: idUser } }
        )
        await TableToken.destroy({
            where: {
                idUser: id,
                type: "verifCreateAccount"
            }
        })
        let initCredit;
        try {
            initCredit = await initCreditUser(db, idUser)
        } catch (err) {
            console.log(err)
        }
        if (!initCredit.success) {
            return { success: false, message: "Echec lors de l'initialisation des crédits" }
        }
        return { success: true, message: "Compte validé avec succes" }
    }
}