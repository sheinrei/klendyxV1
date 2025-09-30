import user from "./../../models/utilisateurTable.js";
import tokenTable from "./../../models/tokenTable.js"
import bcrypt from "bcrypt"



//l'user est déjà auth
export async function resetPassword(db, req, userId) {

    const User = user(db)
    const lastPassword = req.body.lastPassword;
    const newPassword = req.body.newPassword;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);


    const dataUser = await User.findByPk(userId);

    if (!dataUser) {
        return { success: false, message: "Utilisateur introuvable" }
    }


    const match = await bcrypt.compare(lastPassword, dataUser.mdp);

    if (!match) {
        return { success: false, message: "L'ancien mot de passe de correspond pas" }
    } else {
        await User.update(
            { mdp: newPasswordHash },
            {
                where: { id: userId }
            }
        )

        return { success: true, message: "Mot de passe modifié avec succès.", email: dataUser.email, dataUser }
    }

}

export async function confirmTokenResetPassword(tokenUrl, id, db) {

    const Token = tokenTable(db)
    const valid = await Token.findOne({
        where: { token: tokenUrl }
    })

    if (!valid) {
        return false
    }

    if (valid.id && valid.type === "forgotPassword" && valid.idUser == id) {
        console.log("match connexion sécurisé")
        return true
    } else {
        return false
    }
}

export async function changePassword(id, password, db) {

    if (!id || !password) return


    const User = user(db);
    const mdpHashed = await bcrypt.hash(password, 10);

    const change = await User.update(
        { mdp: mdpHashed },
        {
            where: { id }
        }
    )
}