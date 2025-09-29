import express from "express"

//Partage du .env
import dotenv from "dotenv"
dotenv.config()

//gestion
import sendFile from "./src/service/sendFile.js";
import connectDb from "./src/sequelize.js"

//user
import createUser from "./src/route/createUser.js";
import authenticateUser from "./src/route/authUser.js";
import { resetPassword, confirmTokenResetPassword, changePassword } from "./src/service/resetPassword.js";
import { getUserData, getIdByEmail } from "./src/api/getUserData.js";
import verifyAccount from "./src/service/verifyAccount.js";

//securité
import authMiddleware from "./src/service/authMiddleware.js";
//token
import { deleteToken } from "./src/service/deleteToken.js";
import generateToken from "./src/service/generateToken.js";

//NodeMailer
import { sendVerifyAccount, sendPasswordChanged, sendForgotPassword } from "./src/service/nodemailer.js";




//setup express
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

//connection bdd
const db = await connectDb()



//Router page html
app.get("/index", (req, res) => {
    sendFile("./public/index.html", res);
})


app.get("/connection", (req, res) => {
    sendFile("./public/connection.html", res);
})

app.get("/dashboard", (req, res) => {
    sendFile("./public/dashboard.html", res);
})

app.get("/mon-compte", (req, res) => {
    sendFile("./public/configCompte.html", res);
})

app.get("/services", (req, res) => {
    sendFile("./public/services.html", res);
})



//api

//creation d'un nouvel utilisateur
app.post("/api/user/create", async (req, res) => {

    //creer l'user dans le db
    const user = await createUser(req, db)

    //generer un token de creation
    const token = await generateToken(user.id, "verifCreateAccount", db);

    //envoyer l'email
    const url = `http://${process.env.HOST}/user/verify/${token}/${user.id}`
    await sendVerifyAccount(user.email, url)
})


//user connected change password
app.post("/api/user/connected/reset-password", authMiddleware, async (req, res) => {

    const userId = req.userId;
    const changePassword = await resetPassword(db, req, userId)

    const dataUser = changePassword.dataUser;

    if (changePassword.success == true) {
        const recipient = changePassword.email
        await sendPasswordChanged(recipient, dataUser)

        res.json({ success: true, message: "Mot de passe modifié avec succès." })
    } else {
        res.json({ success: false, message: changePassword.message })
    }
})


//forgot password 1 envoi de l'email avec route Token
app.post("/api/user/email/new-password", async function (req, res) {

    //email target
    const email = req.body.emailTarget;

    //recherche l'id d'après cet email
    const id = await getIdByEmail(email, db)

    //generer un token
    const token = await generateToken(id, "forgotPassword", db)

    //envoyer un email
    const url = `http://${process.env.HOST}/api/user/resetpassword/${token}/${id}`
    await sendForgotPassword(email, url)



    res.json({ success: true, message: `Un email a été envoyé si cette adresse existe` })
})


//forgot password 2 controle token et formulaire
app.get("/api/user/resetpassword/:token/:id", async function (req, res) {
    const token = req.params.token;
    const id = req.params.id;

    console.log(id)
    const valid = await confirmTokenResetPassword(token, id, db)

    console.log(valid)
    if (!valid) {
        res.redirect("/index")
        return
    } else {
        res.send(`
                    <form method="POST" action="/api/user/resetpassword/${token}/${id}">
            <input type="password" name="password" placeholder="Nouveau mot de passe" required />
            <button type="submit">Valider</button>
        </form>
            `)

    }
})

//forgot password 3 update et delete du token
app.post("/api/user/resetpassword/:token/:id", async (req, res) => {
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
app.get("/user/verify/:token/:user", async (req, res) => {
    const token = req.params.token;
    const user = req.params.user;

    verifyAccount(token, user, res, db)

})

//Auth utilisateur
app.post("/api/user/connect", async (req, res) => {
    authenticateUser(req, db, res)
})

//get data d'un user
app.get("/api/user/data", authMiddleware, async (req, res) => {
    getUserData(req, db, res)
})





app.listen(port, () => console.log(`Application Node lancé sur : http://localhost:${port}`))