import { exec } from "child_process";
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function uploadGitToProd(req, res) {
    const secret = process.env.WEBHOOK_SECRET
    const params = req.params.token
    //Ecrire dans le fichier deploy log tout les webhook de github
    const logFile = path.join(__dirname, 'deploy.log');
    const timestamp = new Date().toISOString();
    const log = (message) => {
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(logFile, logMessage);
    };
    log("*===== Ping de la route =====*")
    if (secret === params) {
        //verif si c'est bien la branch production
        const branch = req.body.ref.replace('refs/heads/', '')
        if (branch !== 'production') {
            log("=== Pas la branch production on return");
            return
        }
        log("=== Déclenchement du déploiement ===");

        const commands = [
            "cd /home/buyu3307/klendyx.com/production",
            "git fetch origin",
            "git reset --hard origin/production",
            "mkdir -p tmp",
            "touch tmp/restart.txt"
        ].join(" && ");

        try {
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
        } catch (err) {
            log(`Erreur ! Erreur ! Erreur ! ${err}`)
        }


    } else {
        log("*===== Tentative de route sans le bon Token ! =====*")
        res.status(403).send("Token invalide");
    }
}