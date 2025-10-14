import { createTransporter } from "./createTransporter.js";
import { createOption } from "./createMailOption.js";
import { getUserData } from "../user/getUserData.js";
import db from "../../sequelize.js";

export async function sendNewEvent(req, url, email, res) {

    const transporter = createTransporter()

    const { recipientName,
        dateDebut,
        dateFin,
        titleEvent,
        messageEvent } = req.body

    const html = `
    <div>
        Bonjour  ${recipientName},
        Un nouveau rendez-vous vient d'être planifier du ${dateDebut} à ${dateFin},

        Plus d'information : 

        ${messageEvent}

        Afin de valider cette prise de rendez-vous merci de <a href="${url}"> cliquer sur ce lien </a>


    </div>
    `;

    const dataInitialisateur = await getUserData(req, db, res)

    const initialisateur = dataInitialisateur.nom + " " + dataInitialisateur.prenom

    const mailOptions = createOption(email, initialisateur, html, titleEvent)

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
        if (info.messageId) {
            return { success: true, message:`Email envoyé au destinataire ${email}` }
        }
    } catch (err) {
        return {success: false, message: "Erreur survenue avec le serveur."}
    }
}
