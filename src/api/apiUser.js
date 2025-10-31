import express from "express";
const routerApiUser = express.Router()
//user
import createUser from "./../service/user/createUser.js";
import authenticateUser from "./../service/user/authUser.js";
import { resetPassword, confirmTokenResetPassword, changePassword } from "./../service/user/resetPassword.js";
import { getUserData, getIdByEmail } from "./../service/user/getUserData.js";
import verifyAccount from "./../service/user/verifyAccount.js";
//securité
import authMiddleware, { authMiddlewareOptional } from "./../middleware/authMiddleware.js";
//token
import { deleteToken } from "./../service/token/deleteToken.js";
import generateToken from "./../service/token/generateToken.js"
//NodeMailer
import { sendVerifyAccount, sendPasswordChanged, sendForgotPassword } from "./../service/nodemailer.js";
//instance bdd
import db from "./../sequelize.js"
import { frontConfirmationCreateUser } from "../../public/js/frontConfirmationCreateUser.js";
import sendFile from "./../service/sendFile.js";
import { deleteUserSession } from "../service/userSession/deleteUserSession.js";
import { createUserSession } from "../service/userSession/createUserSession.js";
import { getUserSession } from "../service/userSession/getUserSession.js";


//creation d'un nouvel utilisateur
routerApiUser.post("/api/user/create", async (req, res) => {

    //creer l'user dans le db
    const user = await createUser(req, db);

    if (!user.success) {
        return res.json({ sucess: user.success, message: user.message })
    }
    //generer un token de creation
    const id = user.user.id
    const token = await generateToken(id, "verifCreateAccount", db);

    //envoyer l'email
    const url = `${process.env.HOST}/user/verify/${token}/${id}`;
    await sendVerifyAccount(user.user.email, url);

    res.json({ success: true, message: "Bienvenue chez Calendyx, votre compte a été créé avec succes. \n Pour finaliser votre inscription merci de valider votre compte via l'email qui vous a été envoyé." })
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
    const url = `${process.env.HOST}/api/user/resetpassword/${token}/${id}`;
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
        sendFile("./public/pageHtml/newPassword.html", res);

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
    const passwordChange = await changePassword(id, password, db);

    if (passwordChange.success === false) {
        return res.json({ success: false, message: passwordChange.message })
    }

    // Supprimer le token après usage
    await deleteToken(token, db);

    res.json({ success: true, message: `<p id="message-alert-password">Mot de passe modifié avec succès ! <br>Vous allez être redirigé vers votre espace de connexion dans quelques instants.</p>` });
});


//verfication de compte lors de la creation 
routerApiUser.get("/user/verify/:token/:id", async (req, res) => {
    const token = req.params.token;
    const id = req.params.id;

    verifyAccount(token, id, res, db)

    const loginUrl = `${process.env.HOST}/connexion`;
    const contactUrl = `${process.env.HOST}/contact`
    const html = frontConfirmationCreateUser(loginUrl, contactUrl)
    res.send(html)
})

//Auth utilisateur
routerApiUser.post("/api/user/connect", async (req, res) => {
    const auth = await authenticateUser(req, db);

    if (!auth.success) {
        return res.json({ success: false, message: auth.message })
    }

    await createUserSession(db, auth.idUser)

    if (auth.success) {
        res.cookie("token", auth.token, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 1000 * 60 * 60 * 2 // ms * s * m * h
        })
        return res.json({ success: true, message: auth.message, token: auth.token })
    }

})


//Logout user
routerApiUser.post("/api/user/logout", authMiddleware, async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
    })

    await deleteUserSession(db, req)

    res.json({ message: "Utilisateur deconnecté" })
})


//get data d'un user
routerApiUser.get("/api/user/data", authMiddleware, async (req, res) => {
    try {
        const data = await getUserData(req, db, res)
        res.json({
            message: "Donnée de l'utilisateur",
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            raisonSocial: data.raisonSocial,
            siren: data.siren,
            created: data.createdAt,
        })

    } catch (err) {
        console.log("erreur sur /api/user/data : ", err)
    }
})


routerApiUser.get("/api/user/session",authMiddlewareOptional, async (req, res) => {

    if (!req.userId) {
        return res.json({logged:false})
    }

    const session = await getUserSession(db, req)

    return session.logged
        ? res.json({ logged: true })
        : res.json({ logged: false })

})


export default routerApiUser