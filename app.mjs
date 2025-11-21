import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"
import cors from "cors"
//Partage du .env
import dotenv from "dotenv"
dotenv.config()

//router
import routerHtml from "./src/route/routerHtml.js";
import routerApiUser from "./src/api/apiUser.js";
import routerApiEvent from "./src/api/apiEvent.js";
import routerApiCredit from "./src/api/apiCredit.js";
import routerApiCalendar from "./src/api/apiCalendar.js";
import routerApiComment from "./src/api/apiComment.js"
import routerApiContactFav from "./src/api/apiContactFav.js"
//connection bdd
import { initDb } from "./src/sequelize.js"
import { exec } from "child_process";

await initDb()



const app = express();
const port = process.env.PORT;
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
app.use("/api/event", routerApiEvent)
app.use("/api/credit", routerApiCredit)
app.use("/api/calendar", routerApiCalendar)
app.use("/api/comment", routerApiComment)
app.use("/api/contact-favori", routerApiContactFav)

// Définir __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/config", (req, res) => {
    res.json({ host: process.env.HOST })
})


app.post(`/webhook/:token`, (req, res) => {
    const secret = process.env.WEBHOOK_SECRET
    const params = req.params.token

    //Ecrire dans le fichier deploy log tout les webhook de github
    const logFile = path.join(__dirname, 'deploy.log');
    const timestamp = new Date().toISOString();
    const log = (message) => {
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(logFile, logMessage);
    };
    
    
    if (secret === params) {
    
        //verif si c'est bien la branch production
        const branch = req.body.ref.replace('refs/heads/', '')
        if (branch !== 'production') {
            log("=== Pas la branch production on return");
            return
        }


        log("=== Déclenchement du déploiement ===");

        const commands = [
            "cd /home/buyu3307/calendyx.beaute-laurent.fr/production",
            "git pull origin production",
            "mkdir -p tmp",
            "touch tmp/restart.txt"
        ].join(" && ");

        exec(commands, (err, stdout, stderr) => {
            if (err) {
                log(`ERREUR: ${err.message}`);
                log(`stderr: ${stderr}`);
                return res.status(500).send("Erreur lors du déploiement");
            }

            log(`Git pull: ${stdout}`);
            if (stderr) log(`stderr: ${stderr}`);
            log("=== Déploiement terminé ===\n");

            res.send("Déploiement réussi !");
        });
    } else {
        res.status(403).send("Token invalide");
    }
});

app.listen(port, () => console.log(`Application Node lancé sur : http://localhost:${port}/index`))