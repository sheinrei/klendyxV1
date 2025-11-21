import tableToken from "./../../models/tokenTable.js"
import tableUser from "./../../models/utilisateurTable.js";
import { initCreditUser } from "../credit/initCreditUser.js";

export default async function verifyAccount(token, id, res, db) {

    const idUser = id
    const TableToken = tableToken(db)
    const TableUser = tableUser(db)
    const storedToken = await TableToken.findOne({ where: { idUser: id } })

    if (storedToken?.token !== token || !storedToken) {
        res.json({ success: false, message: "Echec lors de la validation de votre compte" })
        return
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
        initCreditUser(db, idUser)
    }
}