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
        return { success: true, message: "Votre mot de passe a été modifié avec succès, une notification du changement de mot de passe vous a été envoyé par email", email: dataUser.email, dataUser }
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

    if (valid.id && valid.type === "forgotPassword" && valid.userId == id) {
        console.log("match connexion sécurisé")
        return true
    } else {
        return false
    }
}

export async function changePassword(id, password, db) {

    if (!id || !password) return { success: false, message: "Id ou password inexistant", data: { id, password } }


    const User = user(db);
    const mdpHashed = await bcrypt.hash(password, 10);

    try {
        const change = await User.update(
            { mdp: mdpHashed },
            {
                where: { id }
            })

        if (change) return { success: true, message: "Changement du mot de passe effectué." }

    } catch (err) {
        return { success: false, message: "Erreur lors du changement de mot de passe, veuillez ressayer plus tard." }
    }


}