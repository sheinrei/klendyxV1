import tableToken from "./../../models/tokenTable.js"
import tableUser from "./../../models/utilisateurTable.js";


export default async function verifyAccount(token, user, res, db) {

    let idUser = user

    const TableToken = tableToken(db)
    const TableUser = tableUser(db)
    const storedToken = await TableToken.findOne({ where: { idUser: idUser } })

    if (storedToken.token !== token || !storedToken) {
        res.json({ success: false, message: "Echec lors de la validation de votre compte" })
        return
    } else {
        await TableUser.update(
            { isVerified: Boolean(true) },
            { where: { id: idUser } }
        )

        res.json({ success: true, message: "Votre compte a bien été validé" })
    }
}