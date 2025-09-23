import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import user from "../models/utilisateur.js"

export default async function authenticateUser(req, db, res) {

    const { emailConnect: email, mdpConnect: userInputPassword } = req.body;

    const User = user(db)
    const stored = await User.findOne({ where: { email: email } })

    const storedPassword = stored.mdp

    bcrypt.compare(userInputPassword, storedPassword, (err, result) => {
        if (err) {
            console.log("Erreur lors de la comparaison bcrypt, errur : ", err)
            return
        }

        if (result) {

            const token = jwt.sign(
                { userId: stored.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )

            res.json({
                message: "Connextion réussis !",
                token
            })
        } else {
            res.send("Mot de passe ou email incorrect !")
        }
    })




}