import user from "./../../models/utilisateurTable.js";

import bcrypt from "bcrypt"

export default async function createUser(req, db) {

    const User = user(db);

    let { nom, prenom, email, mdp, raisonSocial, siren } = req.body;

    const mdpHash = await bcrypt.hash(mdp, 10)

    try {
        const user = await User.create({
            nom,
            prenom,
            email,
            mdp: mdpHash,
            raisonSocial,
            siren,

        });
        // deplacer cette réponse plus loin dans app
        // res.json({ success: true, message: `Utilisateur ${user.nom} créé avec succès !` });
        return user;

    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            return { success: false, message: "Cet email est déjà utilisé" };
        }
        return { success: false, message: "Erreur lors de la création de l'utilisateur" };
    }
}