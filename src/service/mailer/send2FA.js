import { createTransporter } from "./createTransporter.js";



export async function send2FA(email, code) {


    try {
        const transporter = createTransporter();
        const html = `<!DOCTYPE html>
                    <html lang="fr">
                    <head>
                    <meta charset="UTF-8">
                    <title>Votre code de vérification</title>
                    </head>
                    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; margin-top:40px; border-radius:8px; overflow:hidden;">
                        <tr>
                        <td style="background-color:#716af9; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
                            Klendyx
                        </td>
                        </tr>
                        <tr>
                        <td style="padding:30px; text-align:center; font-size:16px; color:#333333;">
                            <p>Bonjour,</p>
                            <p>Voici votre code de vérification pour la connexion à votre compte :</p>
                            <p style="font-size:32px; font-weight:bold; margin:20px 0; color:#716af9;">
                            ${code}
                            </p>
                            <p>Ce code est valide pendant <strong>10 minutes</strong>.</p>
                            <p>Si vous n’avez pas demandé ce code, vous pouvez ignorer cet email.</p>
                            <p>Merci,<br>L’équipe Klendyx</p>
                        </td>
                        </tr>
                        <tr>
                        <td style="background-color:#f4f4f4; padding:20px; text-align:center; font-size:12px; color:#777777;">
                            &copy; 2025 Klendyx. Tous droits réservés.
                        </td>
                        </tr>
                    </table>
                    </body>
                    </html>`


        const mailOptions = {
            from: '"Klendyx" <no-reply@monapp.com>',
            to: email,
            subject: "Votre code de double authentification",
            text: "Retrouvez votre code de doule authentification",
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: info.messageId ? true : false,
            message: info.messageId ? `Email envoyé au destinataire ${email}` : `L'email n'a pas pu être envoyé au destinataire ${email}`
        }

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: process.env.MESSAGE_ERREUR_SERVEUR,
            error: err.message
        }
    }
}