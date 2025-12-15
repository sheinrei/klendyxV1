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
import { sendVerifyAccount, sendPasswordChanged, sendForgotPassword } from "../service/mailer/sendPassword.js";
//instance bdd
import db from "./../sequelize.js"
import sendFile from "./../service/sendFile.js";
import { deleteUserSession } from "../service/userSession/deleteUserSession.js";
import { createUserSession } from "../service/userSession/createUserSession.js";
import { getUserSession } from "../service/userSession/getUserSession.js";
import { updateUserData } from "../service/user/updateUser.js";
import { sendDeleteAccount } from "../service/mailer/sendDeleteAccount.js";
import { deleteAccount } from "../service/user/deleteAccount.js";





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
    console.log(token)
    //envoyer l'email
    const url = `${process.env.HOST}/user-verify/${token.token}/${id}`;
    await sendVerifyAccount(user.user.email, url);

    res.json({ success: true, message: "Votre compte a été créé avec succès, pour finaliser votre inscription merci de valider votre compte via l'email qui vous a été envoyé." })
})




//user connected change password
routerApiUser.post("/api/user/connected/reset-password", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const changePassword = await resetPassword(db, req, userId);

    const dataUser = changePassword.dataUser;
    const urlConnexion = `${process.env.HOST}/connexion`

    if (changePassword.success) {
        const recipient = changePassword.email;
        await sendPasswordChanged(recipient, dataUser, urlConnexion);

        return res.json({ success: true, message: changePassword.message });
    } else {
        return res.json({ success: false, message: changePassword.message });
    }
})




//user change data
routerApiUser.post("/api/user/update", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const data = req.body.data;
    const updated = await updateUserData(db, userId, data);

    return res.json({ success: updated.success, message: updated.message })
})




//forgot password 1 envoi de l'email avec route Token
routerApiUser.post("/api/user/email/new-password", async function (req, res) {

    //email target
    const email = req.body.emailTarget;

    //recherche l'id d'après cet email
    const id = await getIdByEmail(email, db);

    //generer un token
    const token = await generateToken(id, "forgotPassword", db);
    if (!token.success) {
        return res.json({ success: false, message: token.message })
    }
    //envoyer un email
    const url = `${process.env.HOST}/api/user/resetpassword/${token.token}/${id}`;
    const sending = await sendForgotPassword(email, url);
    if (!sending) {
        return res.json({ success: false, message: "Echec lors de l'envois de l'email" })
    }
    return res.json({ success: true, message: `Un email a été envoyé si cette adresse existe` });
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

    const verified = await verifyAccount(token, id, db)
    console.log("verified : ", verified)
    if (!verified.success) {
        return res.json({ success: false, message: verified.message })
    }

    return res.json({ success: true, message: "Succes los de la verification du compte" })
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
        const id = req.userId
        const data = await getUserData(db, id)
        return res.json({
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


routerApiUser.get("/api/user/session", authMiddlewareOptional, async (req, res) => {
    if (!req.userId) {
        return res.json({ logged: false })
    }
    const id = req.userId
    const session = await getUserSession(db, req)
    return session.logged
        ? res.json({ logged: true })
        : res.json({ logged: false })
})

routerApiUser.post("/api/user/send-delete", authMiddleware, async (req, res) => {

    try {
        console.log("send delete")
        const id = req.userId;
        const token = await generateToken(id, "deleteAccount", db);
        const dataUser = await getUserData(db, id)
        const email = dataUser.email
        const url = `${process.env.HOST}/api/user/delete/${token.token}`

        if (token.token) {
            const send = await sendDeleteAccount(email, url);
            return res.json({success:send.success, message : send.message})
        }

    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Une erreur avec le serveur est survenue, veuillez rééssayer plus tard. SI le problème persiste merci de contacter le support" })
    }
})

routerApiUser.get("/api/user/delete/:token", async (req, res) => {
    try {
        const { token } = req.params;

        const deleted = deleteAccount(token, db)

        if(!deleted.success){
            return res.send()
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send(`
            <h1>❌ Erreur serveur</h1>
            <p>Veuillez réessayer plus tard.</p>
        `);
    }
});


export default routerApiUser