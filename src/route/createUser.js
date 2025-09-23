import user from "../models/utilisateur.js";
import bcrypt from "bcrypt"

export default async function createUser(req, db, res) {

    const User = user(db);

    let { nom, prenom, email, mdp, mdpConfirm, raisonSocial, siren } = req.body;

    if (mdp !== mdpConfirm) {
        return res.status(400).send("Mot de passe et confirmation ne correspondent pas")
    }

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
        res.send(`Utilisateur ${user.nom} créé avec succès !`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la création de l'utilisateur");
    }
}