import { createTransporter } from "./createTransporter.js";


export async function sendDeleteAccount(email, url) {

    const transporter = createTransporter();

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
                                KLENDYX - Suppression du Compte
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
                                Nous avons reçu une demande de suppression de votre compte Klendyx.
                            </p>

                            <!-- BLOC INFO -->
                            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 4px; margin: 0 0 20px 0;">
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0;">
                                    ⚠️ <strong>Cette action est définitive.</strong><br>
                                    Une fois confirmée, toutes vos données liées à Klendyx seront supprimées de manière irréversible.
                                </p>
                            </div>
                            
                            <!-- PARAGRAPHE SECONDAIRE -->
                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 25px 0;">
                                Si vous êtes à l'origine de cette demande, cliquez ci-dessous pour confirmer
                            </p>
                            
                            <!-- BOUTON CTA -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 25px 0;">
                                <tr>
                                    <td style="border-radius: 8px; background-color: #ee6e6eff;">
                                        <a href="${url}" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                            Confirmer la suppression
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- DIVIDER -->
                            <div style="height: 2px;background-color: #e5e7eb;margin: 20px 0;"></div>
                            
                            <!-- TEXTE DE CLÔTURE -->
                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                Si vous n’êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.  
                            </p>
                            
                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                Cordialement,<br>
                                <strong>L'Équipe Klendyx</strong>
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
        from: '"Klendyx" <no-reply@monapp.com>',
        to: email,
        subject: "Suppression de votre compte Kledyx",
        text: "Confirmer la suppression de votre compte Klendyx",
        html: html,
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        if (info.messageId) {
            return { success: true, message: `Un email vous a été envoyé à votre adresse ${email}, la suppression de votre compte sera définitive après avoir cliqué sur le bouton depuis cet email.` }
        }
        else {
            return { success: false, message: "Impossible d'envoyer le mail." }
        }
    } catch (err) {
        console.log("Échec de l'envoi, erreur :", err);
    }
}