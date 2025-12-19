import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "./../../models/utilisateurTable.js";

export default async function authenticateUser(req, db) {
    const { emailConnect: email, mdpConnect: userInputPassword } = req.body;

    const User = user(db);
    const stored = await User.findOne({ where: { email } });

    if (!stored) {
        return { success: false, message: "Email ou mot de passe invalide" };
    }

    if (!stored.isVerified) {
        return { success: false, message: "Votre compte n’a pas encore été activé. Veuillez cliquer sur le lien de validation envoyé à votre adresse e-mail." };
    }

    const passwordMatch = await bcrypt.compare(userInputPassword, stored.mdp);

    if (!passwordMatch) {
        return { success: false, message: "Email ou mot de passe invalide" };
    }

    const token = jwt.sign(
        { userId: stored.id },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
    );

    return {
        success: true,
        message: "Connexion réussie !",
        token,
        idUser: stored.id
    };
}
