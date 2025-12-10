import { createTransporter } from "./createTransporter.js";
import { createOption } from "./createMailOption.js";
import { getUserData } from "../user/getUserData.js";
import db from "../../sequelize.js";

export async function sendMatchingEvent(req, url, email) {

    const transporter = createTransporter()
    const dataInitialisateur = await getUserData(req, db)
    const initialisateur = dataInitialisateur.nom + " " + dataInitialisateur.prenom




    const html = `
    <body style="margin: 0;padding: 0;width: 100% !important;background-color: #f8fafc;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
                <td style="padding: 20px 0;">
                    <table style="max-width: 600px;margin: 0 auto;background-color: #ffffff;" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                        
                        <!-- HEADER -->
                        <tr>
                            <td style="background-color: #716af9;padding: 40px 30px;text-align: center;border-radius:20px">
                                <h1 style="color: #ffffff;font-size: 28px;font-weight: 700;margin: 0;line-height: 1.3;">
                                    KLENDYX - Demande de Rendez-Vous
                                </h1>
                            </td>
                        </tr>
                        
                        <!-- CONTENT -->
                        <tr>
                            <td style="padding: 40px 30px;color: #1f2937">
                                <!-- SALUTATION -->
                                <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0;"">
                                    Bonjour,
                                </p>
                                
                                <!-- PARAGRAPHE PRINCIPAL -->
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    ${initialisateur} vous a fait une demande de rendez-vous.
                                </p>
                                
                                <!-- PARAGRAPHE SECONDAIRE (optionnel) -->
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Afin de convenir d'une disponibilité mutuelle merci de cliquer sur le liens qui vous dirigera sur une instance Klendyx.
                                </p>
                                
                                <!-- CALL TO ACTION -->
                                <div style="text-align: center;margin: 35px 0; hover : background-color: #5247c7;">
                                    <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #716af9; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease;">
                                        Convenir d'une date de rendez-vous.
                                    </a>
                                </div>
                                
                                <!-- BOÎTE D'INFORMATION (optionnelle) -->
                                <div style="background-color: #f8fafc;border-left: 4px solid #716af9;padding: 20px;margin: 25px 0;border-radius: 8px;">
                                    <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 10px 0;">
                                        <strong>💡 Détails du rendez-vous :</strong><br>    
                                        -Titre : ${req.body.eventTitle}<br>
                                        -Adresse : ${req.body.eventAddress ?? "Non renseignée"}<br>
                                        -Description : ${req.body.description ?? "Non renseignée"}<br>
                                        -Durée : ${req.body.durationEvent}H<br>
                                        ${req.body.contact.length > 1 ? `-Nombre de participants : ${req.body.contact.length}` : ""}
                                    </p>
                                </div>
                                
                                <!-- DIVIDER -->
                                <div style="height: 1px;background-color: #e5e7eb;margin: 30px 0;"></div>
                                
                                <!-- TEXTE DE CLÔTURE -->
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Klendyx "Gérez votre emplois du temps, gagnez du temps."
                                </p>
                                
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Cordialement,<br>
                                    <strong>Votre Équipe</strong>
                                </p>
                                
                            </td>
                        </tr>                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    `;


    const mailOptions = createOption(email, initialisateur, html, req.body.eventTitle)

    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.messageId) {
            return { success: true, message: `Email envoyé au destinataire ${email}` }
        }
    } catch (err) {
        return { success: false, message: "Erreur survenue avec le serveur." }
    }
}
