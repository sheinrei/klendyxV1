import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"



//router
import routerHtml from "./src/route/routerHtml.js";
import routerApiUser from "./src/api/apiUser.js";
import routerApiUserPreference from "./src/api/apiUserPreference.js";
import routerApiRdv from "./src/api/apiRdv.js";
import routerApiRappelRdv from "./src/api/apiRappelRdv.js"
import routerApiCredit from "./src/api/apiCredit.js";
import routerApiComment from "./src/api/apiComment.js";
import routerApiContactFav from "./src/api/apiContactFav.js";
import routerApiMatching from "./src/api/apiMatching.js";
import routerApiPayment from "./src/api/apiPayment.js"
import routerApiCalendar from "./src/api/apiCalendar.js";
import routerAuthCalendarGoogle from "./src/api/authGoogle.js"
import routerAuthCalendarOutlook from "./src/api/authOutlook.js"
import routerAuthCalendarApple from "./src/api/authApple.js"


//connection bdd
import { initDb } from "./src/sequelize.js"


//webhook
import { uploadGitToProd } from "./src/service/webhookGit.js"
import { startCronTask } from "./src/service/cronTask/cronStart.js";



const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: process.env.HOST,
    credentials: true,
}))
app.use(express.static("public"));



app.use("/", routerHtml);
app.use("/", routerApiUser);
app.use("/api/rdv", routerApiRdv)
app.use("/api/rappel-rdv", routerApiRappelRdv)
app.use("/api/credit", routerApiCredit)
app.use("/api/comment", routerApiComment)
app.use("/api/contact-favori", routerApiContactFav)
app.use("/api/matching-event", routerApiMatching)
app.use("/api/userPreference", routerApiUserPreference)

//stripe
app.use("/api/payment", routerApiPayment)

//Calendar
app.use("/api/calendar", routerApiCalendar) //Instance principal de tout les calendar
app.use("/api/calendar/google", routerAuthCalendarGoogle)  //sync
app.use("/api/calendar/outlook", routerAuthCalendarOutlook) //sync
app.use("/api/calendar/apple", routerAuthCalendarApple) //sync



//Get les config non sensible pour le front
app.get("/config", (req, res) => {
    res.json({ host: process.env.HOST })
})

//Webhook pour mettre à jours serveur prod
app.post(`/webhook/:token`, (req, res) => {
    uploadGitToProd(req, res)
});

app.listen(port, async () => {
    try {
        console.log(`Application Node lancé sur : http://localhost:${port}/index`)
        //Lancement des tâches cron
        startCronTask(true)
        //Connexion de la base de donnée
        await initDb()
    } catch (err) {
        console.warn(err)
    }
})


