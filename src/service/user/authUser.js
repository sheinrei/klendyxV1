import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from "./../../models/utilisateurTable.js";

export default async function authenticateUser(req, db, res) {

    const { emailConnect: email, mdpConnect: userInputPassword } = req.body;

    const User = user(db)
    const stored = await User.findOne({ where: { email: email } })
    if (!stored) {

        res.json({ succes: false, message: "Email ou mot de passe invalide" })
        return
    }

    const storedPassword = stored.mdp
    const verified = stored.isVerified

    if (verified === false) {
        res.json({ success: false, message: "Votre compte n'a pas été activé, merci de le valider en cliquant sur le liens que vous avez reçu dans votre email de bienvenue." })
        return
    }

    bcrypt.compare(userInputPassword, storedPassword, (err, result) => {
        if (err) {
            res.json({ success: false, message: "Erreur survenue lors de la connection" })
            return
        }

        if (result) {
            const token = jwt.sign(
                { userId: stored.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )

            res.json({
                success: true,
                message: "Connextion réussis !",
                token
            })
        } else {
            res.json({ success: false, message: "Email ou mot de passe invalide" })
        }
    })




}