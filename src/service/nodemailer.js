import nodemailer from "nodemailer"



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