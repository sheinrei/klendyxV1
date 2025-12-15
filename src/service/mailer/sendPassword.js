import nodemailer from "nodemailer"



//Envoie l'email de creation de compte avec l'url pour activer le compte
export async function sendVerifyAccount(recipient, url) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
        }
    })


    const html = `<body style="margin: 0;padding: 0;width: 100% !important;background-color: #f8fafc;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tr>
                            <td style="padding: 20px 0;">
                                <table style="max-width: 600px;margin: 0 auto;background-color: #ffffff;" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                                    
                                    <!-- HEADER -->
                                    <tr>
                                        <td style="background-color: #716af9;padding: 20px 30px;text-align: center;border-radius:20px">
                                            <h1 style="color: #ffffff;font-size: 28px;font-weight: 700;margin: 0;line-height: 1.3;">
                                                Bienvenue chez Klendyx 🎉
                                            </h1>
                                        </td>
                                    </tr>
                                    
                                    <!-- CONTENT -->
                                    <tr>
                                        <td style="padding: 40px 30px;color: #1f2937">
                                            
                                            <!-- SALUTATION -->
                                            <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0;">
                                                Bonjour,
                                            </p>

                                            <!-- MESSAGE PRINCIPAL -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                                Merci de vous êtes inscrit sur notre application <strong>Klendyx</strong>. Nous sommes ravis de vous avoir parmi nous !
                                            </p>

                                            <!-- MESSAGE SECONDAIRE -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                                Pour activer votre compte, cliquez sur le bouton ci-dessous :
                                            </p>

                                            <!-- CALL TO ACTION -->
                                            <div style="text-align: center;margin: 35px 0;">
                                                <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #716af9; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease;">
                                                    Activer mon compte
                                                </a>
                                            </div>

                                            <!-- NOTE -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 25px 0;">
                                                Si vous n’etes pas à l’origine de cette inscription, vous pouvez ignorer cet e-mail.
                                            </p>

                                            <!-- DIVIDER -->
                                            <div style="height: 1px;background-color: #e5e7eb;margin: 30px 0;"></div>

                                            <!-- SIGNATURE -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937;margin: 0 0 20px 0;">
                                                Bienvenue encore une fois,<br>
                                                <strong>L’équipe Klendyx</strong>
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- FOOTER -->
                                    <tr>
                                        <td style="text-align: center;padding: 16px;background-color: #f8fafc;border-radius: 8px;">
                                            <p style="font-size: 12px; color: #6b7280; margin: 0;">
                                                © 2025 Klendyx — Tous droits réservés.
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>`;

    const mailOptions = {
        from: '"Klendyx" <no-reply@monapp.com>',
        to: recipient,
        subject: "Bienvenue 🎉 Confirmez votre compte",
        text: "Bonjour ! Bienvenue sur Klendyx. Confirmez votre compte en cliquant sur le lien.",
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message envoyé avec succès", info.messageId);
    } catch (err) {
        console.log("Échec de l'envoi, erreur :", err);
    }
}



//Envois l'email de confirmation de changement de mot de passe
export async function sendPasswordChanged(recipient, User, urlConnexion) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
        }
    });

    const html = `
                <div style="
                    font-family: Arial, sans-serif; 
                    color: #1f2937; 
                    line-height: 1.6; 
                    max-width: 600px; 
                    margin: auto; 
                    padding: 24px; 
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    border: 1px solid #e5e7eb;
                ">

                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="
                            margin: 0;
                            font-size: 24px;
                            background: linear-gradient(to right, rgba(113, 106, 249, 1) 0%, rgba(91, 9, 121, 1) 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        ">
                            Mot de passe modifié 🔒
                        </h2>
                    </div>

                    <p style="margin: 0 0 16px 0;">Bonjour ${User.prenom},</p>

                    <p style="margin: 0 0 16px 0; color: #6b7280;">
                        Nous te confirmons que le mot de passe de ton compte <strong>Klendyx</strong> a bien été modifié avec succès.
                    </p>

                    <div style="margin: 28px 0; text-align: center;">
                        <a href="${urlConnexion}" style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #716af9;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                            transition: opacity 0.3s;
                        ">
                            Se connecter
                        </a>
                    </div>

                    <p style="font-size: 13px; color: #b3b7be; margin-top: 30px;">
                        Si tu n’es pas à l’origine de cette modification, contacte immédiatement notre support.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

                    <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                        <p style="font-size: 12px; color: #6b7280; margin: 0;">
                            © 2025 Klendyx — Tous droits réservés.
                        </p>
                    </div>
                </div>
    `;

    const mailOptions = {
        from: '"Klendyx" <no-reply@monapp.com>',
        to: recipient,
        subject: "Mot de passe changé 🔒",
        text: "Votre mot de passe a été modifié.",
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("Échec de l'envoi, erreur :", err);
    }
}

export async function sendForgotPassword(recipient, url) {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS
        }
    });

    const html = `<body style="margin: 0;padding: 0;width: 100% !important;background-color: #f8fafc;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                        <tr>
                            <td style="padding: 20px 0;">
                                <table style="max-width: 600px;margin: 0 auto;background-color: #ffffff;" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                                    
                                    <!-- HEADER -->
                                    <tr>
                                        <td style="background-color: #716af9;padding: 20px 30px;text-align: center;border-radius:20px">
                                            <h1 style="color: #ffffff;font-size: 28px;font-weight: 700;margin: 0;line-height: 1.3;">
                                                Réinitialisation de votre mot de passe
                                            </h1>
                                        </td>
                                    </tr>
                                    
                                    <!-- CONTENT -->
                                    <tr>
                                        <td style="padding: 40px 30px;color: #1f2937">
                                            
                                            <!-- SALUTATION -->
                                            <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0;">
                                                Bonjour,
                                            </p>

                                            <!-- MESSAGE PRINCIPAL -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                                Vous avez fait une demande de réitinialisation de votre mot de passe.
                                            </p>

                                            <!-- MESSAGE SECONDAIRE -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                                Pour réitinialiser votre mot de passe, cliquez sur le bouton ci-dessous :
                                            </p>

                                            <!-- CALL TO ACTION -->
                                            <div style="text-align: center;margin: 35px 0;">
                                                <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #716af9; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s ease;">
                                                    Réitinialiser le mot de passe
                                                </a>
                                            </div>

                                            <!-- NOTE -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 25px 0;">
                                                Si vous n'êtes pas à l'origine de cette demande vous pouvez ignorer cet e-mail
                                            </p>

                                            <!-- DIVIDER -->
                                            <div style="height: 1px;background-color: #e5e7eb;margin: 30px 0;"></div>

                                            <!-- SIGNATURE -->
                                            <p style="font-size: 16px; line-height: 1.6; color: #1f2937;margin: 0 0 20px 0;">
                                                <strong>L’équipe Klendyx</strong>
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- FOOTER -->
                                    <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                        Cordialement,<br>
                                        <strong>Votre Équipe Klendyx</strong>
                                    </p>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>`;


    const mailOptions = {
        from: '"Klendyx" <no-reply@monapp.com>',
        to: recipient,
        subject: "Réinitialiser votre mot de passe Klendyx",
        text: "Réinitialiser votre mot de passe Klendyx",
        html: html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("Échec de l'envoi, erreur :", err);
    }
}