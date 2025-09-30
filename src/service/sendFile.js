import path from "path"
import { fileURLToPath } from "url";


//Sert à recrer l'url pour target le fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


export default function sendFile(fileName, res) {
    const options = {
<<<<<<< HEAD
        root: path.join(__dirname, "../../")
=======
        root: path.join(__dirname, "../..")
>>>>>>> c15eeb1 (finish refactor structure)
    }
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.log("prolème lors du chargement du fichier :", fileName, "- erreur : ", err)
        } else {
            console.log("Sent", fileName)
        }
    })
}