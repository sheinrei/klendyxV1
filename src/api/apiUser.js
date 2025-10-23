import express from "express";
const routerApiUser = express.Router()
//user
import createUser from "./../service/user/createUser.js";
import authenticateUser from "./../service/user/authUser.js";
import { resetPassword, confirmTokenResetPassword, changePassword } from "./../service/user/resetPassword.js";
import { getUserData, getIdByEmail } from "./../service/user/getUserData.js";
import verifyAccount from "./../service/user/verifyAccount.js";
//securité
import authMiddleware from "./../middleware/authMiddleware.js";
//token
import { deleteToken } from "./../service/token/deleteToken.js";
import generateToken from "./../service/token/generateToken.js"
//NodeMailer
import { sendVerifyAccount, sendPasswordChanged, sendForgotPassword } from "./../service/nodemailer.js";
//instance bdd
import db from "./../sequelize.js"
import { frontConfirmationCreateUser } from "../../public/js/frontConfirmationCreateUser.js";


//creation d'un nouvel utilisateur
routerApiUser.post("/api/user/create", async (req, res) => {

    //creer l'user dans le db
    const user = await createUser(req, db);

    //generer un token de creation
    const token = await generateToken(user.id, "verifCreateAccount", db);

    //envoyer l'email
    const url = `${process.env.HOST}/user/verify/${token}/${user.id}`;
    await sendVerifyAccount(user.email, url);

    res.json({ succes: true, message: "Bienvenue chez Calendyx, merci de confirmer votre compte avec l'email qui vous a été envoyé." })
})


//user connected change password
routerApiUser.post("/api/user/connected/reset-password", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const changePassword = await resetPassword(db, req, userId);

    const dataUser = changePassword.dataUser;

    if (changePassword.success == true) {
        const recipient = changePassword.email;
        await sendPasswordChanged(recipient, dataUser);

        res.json({ success: true, message: "Mot de passe modifié avec succès." });
    } else {
        res.json({ success: false, message: changePassword.message });
    }
})



//forgot password 1 envoi de l'email avec route Token
routerApiUser.post("/api/user/email/new-password", async function (req, res) {

    //email target
    const email = req.body.emailTarget;

    //recherche l'id d'après cet email
    const id = await getIdByEmail(email, db);

    //generer un token
    const token = await generateToken(id, "forgotPassword", db);

    //envoyer un email
    const url = `http://${process.env.HOST}/api/user/resetpassword/${token}/${id}`;
    await sendForgotPassword(email, url);

    res.json({ success: true, message: `Un email a été envoyé si cette adresse existe` });
})


//forgot password 2 controle token et formulaire
routerApiUser.get("/api/user/resetpassword/:token/:id", async function (req, res) {
    const token = req.params.token;
    const id = req.params.id;

    const valid = await confirmTokenResetPassword(token, id, db);

    if (!valid) {
        res.redirect("/index");
        return
    } else {
        res.send(`
                    <form method="POST" action="/api/user/resetpassword/${token}/${id}">
            <input type="password" name="password" placeholder="Nouveau mot de passe" required />
            <button type="submit">Valider</button>
        </form>
            `);

    }
})

//forgot password 3 update et delete du token
routerApiUser.post("/api/user/resetpassword/:token/:id", async (req, res) => {
    const { token, id } = req.params;
    const { password } = req.body;

    // Revalide le token avant de changer le mot de passe
    const valid = await confirmTokenResetPassword(token, id, db);
    if (!valid) return res.status(400).send("Token invalide ou expiré");

    // Hash et update du mot de passe
    await changePassword(id, password, db);

    // Supprimer le token après usage
    await deleteToken(token, db);

    res.send("Mot de passe modifié avec succès ! <a href='/connection'>Revenir à l'écran de connection</a>.");
});


//verfication de compte lors de la creation 
routerApiUser.get("/user/verify/:token/:id", async (req, res) => {
    const token = req.params.token;
    const id = req.params.id;

    verifyAccount(token, id, res, db)

    const loginUrl = `http://${process.env.HOST}/connection`;
    const contactUrl = `http://${process.env.HOST}/contact`
    const html = frontConfirmationCreateUser(loginUrl, contactUrl)
    res.send(html)
})

//Auth utilisateur
routerApiUser.post("/api/user/connect", async (req, res) => {
    authenticateUser(req, db, res)
})

//get data d'un user
routerApiUser.get("/api/user/data", authMiddleware, async (req, res) => {
    const data = await getUserData(req, db, res)
    res.json({
        message: "Donnée de l'utilisateur",
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        mdp: data.mdp,
        raisonSocial: data.raisonSocial,
        siren: data.siren,
        created: data.createdAt,
    })
})


export default routerApiUser