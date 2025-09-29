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


    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4CAF50;">Bienvenue chez Calendyx 🎉</h2>
        <p>Salut ! Merci de t'être inscrit sur notre application.</p>
        <p>Pour activer ton compte, clique sur le bouton ci-dessous :</p>
        <p style="text-align: center;">
            <a href="${url}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                Activer mon compte
            </a>
        </p>
        <p>Si tu n'as pas créé de compte, ignore simplement cet email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">© 2025 Calendyx. Tous droits réservés.</p>
    </div>
    `;

    const mailOptions = {
        from: '"Calendyx" <no-reply@monapp.com>',
        to: recipient,
        subject: "Bienvenue 🎉 Confirme ton compte",
        text: "Salut ! Bienvenue sur Calendyx. Confirme ton compte en cliquant sur le lien.",
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
export async function sendPasswordChanged(recipient, User) {

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
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4CAF50;">Mot de passe modifié 🔒</h2>
        <p>Bonjour ${User.prenom}</p>
        <p>Nous te confirmons que le mot de passe de ton compte Calendyx a bien été modifié avec succès.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">© 2025 Calendyx. Tous droits réservés.</p>
    </div>
    `;

    const mailOptions = {
        from: '"Calendyx" <no-reply@monapp.com>',
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

    const html = `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
  <h2 style="color: #4CAF50; text-align: center;">Réinitialisation de mot de passe 🔒</h2>
  <p>Bonjour,</p>
  <p>Tu as demandé à réinitialiser ton mot de passe pour ton compte <strong>Calendyx</strong>.</p>
  <p>Pour définir un nouveau mot de passe, clique simplement sur le bouton ci-dessous :</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${url}" 
       style="background-color: #4CAF50; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
      Réinitialiser mon mot de passe
    </a>
  </div>
  
  <p>⚠️ Ce lien expirera dans <strong>24 heures</strong>. Si tu n’es pas à l’origine de cette demande, tu peux ignorer cet email en toute sécurité.</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <p style="font-size: 12px; color: #999; text-align: center;">
    © 2025 Calendyx. Tous droits réservés.
  </p>
</div>
`;


    const mailOptions = {
        from: '"Calendyx" <no-reply@monapp.com>',
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