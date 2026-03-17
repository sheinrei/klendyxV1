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
import { deleteAllUserTokenByType, deleteToken } from "./../service/token/deleteToken.js";
import generateToken from "./../service/token/generateToken.js"
//instance bdd
import db from "./../sequelize.js"
import sendFile from "./../service/sendFile.js";
import { UserSession } from "../service/userSession/ClassUserSession.js";


import { updateUserData } from "../service/user/updateUser.js";
import { KlendyxMailer } from "./../service/mailer/ClassMailer.js"
import { deleteAccount } from "../service/user/deleteAccount.js";



import { getAllEvents } from "../service/calendar/CalendarController.js";

import { UserPreference } from "../service/userPreference/ClassUserPreference.js";

import { getAllContactFav } from "../service/contactFav/getContactFav.js";
import { getCredit } from "../service/credit/getCredit.js";
import { getUserRappelRdv } from "../service/rappelRdv/getRappelRdv.js";
import { getAllMatchingEvent } from "../service/event/getMatchingEvent.js";
import { getAllPropositionRdv } from "../service/event/getPropositionRdv.js";
import { create2FA } from "../service/user/create2FA.js";
import { getToken } from "../service/token/getToken.js";

import jwt from "jsonwebtoken";



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
    const mailer = new KlendyxMailer(user.user.email)
    const send = await mailer.sendVerifyAccount(url)

    return res.json({
        success: true,
        message: "Votre compte a été créé avec succès. Pour finaliser votre inscription, veuillez valider votre compte via l’email qui vous a été envoyé."
    })
})




//user connected change password
routerApiUser.post("/api/user/connected/reset-password", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const changePassword = await resetPassword(db, req, userId);

    const dataUser = changePassword.dataUser;
    const urlConnexion = `${process.env.HOST}/connexion`

    if (changePassword.success) {
        const email = changePassword.email;
        const mailer = new KlendyxMailer(email)
        const sending = await mailer.sendPasswordChanged(dataUser, urlConnexion)
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
    const mailer = new KlendyxMailer(email)
    const sending = await mailer.sendForgotPassword(url);
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

    try {

        const auth = await authenticateUser(req, db);

        if (!auth.success) {
            return res.json({
                success: false,
                message: auth.message
            })
        }

        const userId = auth.userId
        const Session = new UserSession(userId).createUserSession()
        

        const userPreference = await new UserPreference(userId).getUserPreference()

        const user2FA = userPreference.data.doubleAuth


        if (user2FA) {
            const sending = await create2FA(db, userId);

            return res.json({
                success: sending.success,
                message: sending.message,
                "2FA": true,
                id: userId
            })


        }


        if (auth.success) {
            res.cookie("token", auth.token, {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 1000 * 60 * 60 * 4 // ms * s * m * h
            })
            return res.json({
                success: true,
                message: auth.message,
            })
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: process.env.MESSAGE_ERREUR_SERVEUR,
            error: err.message
        })
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

    new UserSession(req.userId).deleteUserSession()
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
    const session = await new UserSession(id).getUserSession()
    return session.logged
        ? res.json({ logged: true })
        : res.json({ logged: false })
})



routerApiUser.post("/api/user/send-delete", authMiddleware, async (req, res) => {

    try {
        const id = req.userId;
        const token = await generateToken(id, "deleteAccount", db);
        const dataUser = await getUserData(db, id)
        const email = dataUser.email
        const url = `${process.env.HOST}/api/user/delete/${token.token}`


        if (token.token) {
            const mailer = new KlendyxMailer(email)
            const send = await mailer.sendDeleteAccount(url);
            return res.json({ success: send.success, message: send.message })
        }

    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Une erreur avec le serveur est survenue, veuillez rééssayer plus tard. SI le problème persiste merci de contacter le support" })
    }
})



routerApiUser.get("/api/user/delete/:token", async (req, res) => {
    try {
        const { token } = req.params;

        const deleted = await deleteAccount(token, db)


        return res.send(`
            <p>${deleted.message}</p>
            `)


    } catch (err) {
        console.log(err);
        return res.status(500).send(`
            <h1>❌ Erreur serveur</h1>
            <p>Veuillez réessayer plus tard.</p>
        `);
    }
});




//generer un pdf 
routerApiUser.get("/api/user/export-data", authMiddleware, async (req, res) => {

    const userId = req.userId;

    const dataUser = await getUserData(db, userId);
    const dataPreference = await new UserPreference(userId).getUserPreference();
    const dataContactFavori = await getAllContactFav(db, req);
    const dataEventKlendyx = await getAllEvents("klendyx", db, userId);
    const dataCredit = await getCredit(db, userId)
    const dataRappelRdv = await getUserRappelRdv(db, userId);
    const dataMatchingEvent = await getAllMatchingEvent(db, userId);

    const dataPropositionRdv = await getAllPropositionRdv(db, req);

    const data = {
        userData: {
            nom: dataUser.nom,
            prenom: dataUser.prenom,
            email: dataUser.email,
            raisonSocial: dataUser.raisonSocial,
            siren: dataUser.siren,
            abbonnement: dataUser.abonnement,
            createdAt: dataUser.createdAt,
            updatedAt: dataUser.updatedAt
        },
        userPreference: {
            emailnotification: dataPreference.data.emailNotification,
            doubleAuth: dataPreference.data.doubleAuth
        },

        favoriteContacts: dataContactFavori.data,

        proposedAppointment: dataPropositionRdv.data,

        klendyxEvent: {
            totalEvent: dataEventKlendyx.data.data.count,
            event: dataEventKlendyx.data.data.events
        },

        appointmentReminder: dataRappelRdv,
        klendyxMatchingEvent: dataMatchingEvent,

        userCredit: {
            plan: dataCredit.pan,
            sms: dataCredit.sms,
            email: dataCredit.mail,
            createdAt: dataCredit.createdAt,
            updatedAt: dataCredit.updatedAt,
        }

    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=rgpd.json"
    );

    res.send(JSON.stringify(data, null, 2));
})



routerApiUser.post("/api/user/auth-2FA", async (req, res) => {

    try {
        const userId = req.body.userId;
        const code = req.body.code;
        const token = await getToken("2FA", userId, db);


        if (token.totalToken == code) {

            const jwtToken = jwt.sign(
                { userId: userId },
                process.env.JWT_SECRET,
                { expiresIn: "4h" }
            );

            res.cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 1000 * 60 * 60 * 4 // ms * s * m * h
            })


            //delete le token
            await deleteAllUserTokenByType(db, userId, "2FA")


            return res.json({
                success: true,
                message: "Double authentification réussis"
            })

        } else {
            return res.json({
                success: false,
                message: "Le code que vous avez saisis ne correspond pas"
            })
        }

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: process.env.MESSAGE_ERREUR_SERVEUR,
            error: err.message
        }
    }

})

export default routerApiUser