import { createTransporter } from "./createTransporter.js";


export async function sendPropositionRdvResolv(req,email, nameInitialisateur,recipientPropositionFullName) {

    const transporter = createTransporter()
    const responsProposition = req.body.responseUser == true ? "validé" : "refusé";
    const commentaire = req.body.message || "Pas de commentaire ajouté"

    const html = `<div style="margin:20px">
                    <header style="margin-bottom:30px">
                        <p>Bonjour ${nameInitialisateur}</p>
                    </header>
                    
                    <div>
                        <p>${recipientPropositionFullName} a répondu à votre demande de rendez-vous</p>
                        <p>Réponse : ${responsProposition}</p>
                        <p>Commentaire saisis avec la réponse : ${commentaire}</p>

                    </div>

                    <div style="margin-top:15px">
                        <p>A bientôt,</p>
                        <p>Votre équipe</p>
                    </div>
                </div>`


    const mailOptions = {
        from: '"Klendyx" <no-reply@klendyx.com>',
        to: email,
        subject: `${recipientPropositionFullName} a répondu a votre proposition de rendez-vous`,
        text: `${recipientPropositionFullName} a répondu a votre proposition de rendez-vous`,
        html: html,
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
        if (info.messageId) {
            return {
                success: true, message: `Email envoyé au destinataire ${email}`
            }
        }
    } catch (err) {
        return { success: false, message: "Erreur survenue avec le serveur." }
    }
}
