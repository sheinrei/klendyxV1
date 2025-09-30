import express from "express"

//Partage du .env
import dotenv from "dotenv"
dotenv.config()

//router
import routerHtml from "./src/route/routerHtml.js";
import routerApiUser from "./src/api/apiUser.js";

//connection bdd
import { initDb } from "./src/sequelize.js"
await initDb()


//setup express
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/", routerHtml);
app.use("/", routerApiUser);




app.listen(port, () => console.log(`Application Node lancé sur : http://localhost:${port}`))