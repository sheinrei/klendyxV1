import { createTransporter } from "./createTransporter.js";

export async function sendResolvMatching(email, eventTitle, url) {

    const transporter = createTransporter()
    const titleEvent = eventTitle

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
                                        ✨ KLENDYX - Dates Disponibles
                                    </h1>
                                </td>
                            </tr>
                            
                            <!-- CONTENT -->
                            <tr>
                                <td style="padding: 40px 30px;color: #1f2937">
                                    <!-- SALUTATION -->
                                    <p style="font-size: 18px; font-weight: 500; color: #1f2937; margin: 0 0 20px 0;">
                                        Bonjour,
                                    </p>
                                    
                                    <!-- PARAGRAPHE PRINCIPAL -->
                                    <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                        Bonne nouvelle! Tous les participants ont répondu à votre demande de rendez-vous.
                                    </p>
                                    
                                    <!-- BLOC INFO -->
                                    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 4px; margin: 0 0 20px 0;">
                                        <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0;">
                                            🎯 <strong>Klendyx</strong> a terminé l'analyse des créneaux compatibles avec l’emploi du temps de tous vos correspondants.
                                        </p>
                                    </div>
                                    
                                    <!-- PARAGRAPHE SECONDAIRE -->
                                    <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 25px 0;">
                                        Pour finaliser cet événement et notifier tous les participants, veuillez valider votre choix :
                                    </p>
                                    
                                    <!-- BOUTON CTA -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 25px 0;">
                                        <tr>
                                            <td style="border-radius: 8px; background-color: #716af9;">
                                                <a href="${url}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                                    📅 Choisir une date
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- DIVIDER -->
                                    <div style="height: 2px;background-color: #e5e7eb;margin: 20px 0;"></div>
                                    
                                    <!-- TEXTE DE CLÔTURE -->
                                    <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                        Klendyx "Gérez votre emploi du temps, gagnez du temps."
                                    </p>
                                    
                                    <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                        Cordialement,<br>
                                        <strong>Votre Équipe Klendyx</strong>
                                    </p>
                                    
                                </td>
                            </tr>                        
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        `;


    const mailOptions = {
        from: '"Klendyx" <no-reply@Klendyx.com>',
        to: email,
        subject: `Votre demande de matching de rendez-vous Klendyx est resolue`,
        text: titleEvent,
        html: html,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.messageId) {
            return { success: true, message: `Email envoyé au destinataire ${email}` }
        }
        else {
            return { success: false, message: "Impossible d'envoyer le mail." }
        }
    } catch (err) {
        return { success: false, message: "Erreur survenue avec le serveur." }
    }
}