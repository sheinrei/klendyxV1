import express from "express"

import createUser from "./src/route/createUser.js";
import authenticateUser from "./src/route/authUser.js";
import connectDb from "./src/sequelize.js"
import sendFile from "./src/service/sendFile.js";

import authMiddleware from "./src/service/authMiddleware.js";

import getUserData from "./src/api/getUserData.js";

//Partage du .env
import dotenv from "dotenv"
dotenv.config()


//setup express
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))




//Page html
app.get("/index", (req, res) => {
    sendFile("./public/index.html", res);
})


app.get("/connection", (req, res) => {
    sendFile("./public/connection.html", res);
})

app.get("/dashboard", (req, res) => {

    /*     res.json({
            message: "Données du dashboard",
            userId: req.userId
        }) */
    sendFile("./public/dashboard.html", res);
})

app.get("/mon-compte", (req, res) => {
    sendFile("./public/configCompte.html", res);
})

app.get("/services", (req, res) => {
    sendFile("./public/services.html", res);
})









//api
const db = await connectDb()
app.post("/api/user/create", async (req, res) => {
    createUser(req, db, res)
})

app.post("/api/user/connect", async (req, res) => {
    authenticateUser(req, db, res)
})

app.get("/api/user/data",authMiddleware ,  async(req, res)=>{
    getUserData(req, db, res)
})

app.listen(port, () => console.log(`Application Node lancé sur : http://localhost:${port}`))