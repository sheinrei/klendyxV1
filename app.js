import express from "express"
import dotenv from "dotenv"
dotenv.config()

import createUser from "./src/route/createUser.js";
import authenticateUser from "./src/route/authUser.js";
import connectDb from "./src/sequelize.js"
import sendFile from "./src/service/sendFile.js";

import authMiddleware from "./src/service/authMiddleware.js";

import getUserData from "./src/api/getUserData.js";
import { sendVerifyAccount } from "./src/service/nodemailer.js";


//Partage du .env
import verifyAccount from "./src/service/verifyAccount.js";
import generateToken from "./src/service/generateToken.js";


//setup express
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

//connection bdd
const db = await connectDb()



//Page html
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

app.post("/api/user/create", async (req, res) => {

    //creer l'user dans le db
    const user = await createUser(req, db)

    //generer un token de creation
    const token = await generateToken(user.id, "verifCreationAccount", db);

    //envoyer l'email
    const url = `http://${process.env.HOST}/user/verify/${token}/${user.id}`
    await sendVerifyAccount(user.email, url)
})


app.get("/user/verify/:token/:user", async (req, res) => {
    const token = req.params.token;
    const user = req.params.user;

    verifyAccount(token, user, res, db)

})


app.post("/api/user/connect", async (req, res) => {
    authenticateUser(req, db, res)
})


app.get("/api/user/data", authMiddleware, async (req, res) => {
    getUserData(req, db, res)
})


//envoi email
app.get("/test-mail", async (req, res) => {
    await sendMail("l.beaute@laposte.net", req, res);
});

app.listen(port, () => console.log(`Application Node lancé sur : http://localhost:${port}`))