import { createTransporter } from "./createTransporter.js";
import { createOption } from "./createMailOption.js";


export async function sendPropositionRdv(url, email, prenom, nameInitialisateur, title, commentaire, dayStart, hourStart, hourEnd) {

    const transporter = createTransporter()
    const day = new Date(dayStart.replace(":", "-"))


    const html = `<div style="margin:20px">
                    <header style="margin-bottom:30px">
                        <p>Bonjour ${prenom},</p>
                        <p>${nameInitialisateur} vous propose un rendez-vous "${title}" </p>
                    </header>

                    <p style="margin-bottom:20px">Information du rendez-vous :</p>

                    <div style="width:fit-content;margin-left:50px; background-color: #F7FAFF;border-radius: 8px;padding: 20px 10px;margin-bottom: 30px; display:flex; flex-direction:column;gap:10px">

                        <div style="display:flex; flex-direction:row; margin:0; gap:15px; align-items:center; justify-content:start">

                            <svg style="width:40px; margin:0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                            </svg>

                            <div style="display:flex; flex-direction:column; align-items:flex-start; margin:0">
                                <p style="margin:0;width:100%">Date</p>
                                <p style="margin:0;width:100%">${day.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })}</p>
                            </div>
                        </div>


                        <div style="display:flex; flex-direction:row; margin:0; gap:15px; align-items:center; justify-content:start">

                            <svg style="width:40px; margin:0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>

                            <div style="display:flex; flex-direction:column; align-items:flex-start; margin:0">
                                <p style="margin:0;width:100%">Horaire</p>
                                <p style="margin:0;width:100%">${hourStart.replace(":", "h")} à ${hourEnd.replace(":", "h")}</p>
                            </div>
                        </div>

                    </div>

                    <div>
                        ${commentaire ? `<p style="margin-bottom:15px">Information complémentaire : ${commentaire} </p>` : ""}
                    </div>

                    <p style="margin-bottom:15px">Merci de renseigner votre réponse en cliquant sur le boutton ci dessous  : </p>

                    <a href="${url}"
                            style="
                                padding: 8px 15px;
                                background: linear-gradient(to right, rgba(113,106,249,1) 0%, rgba(91,9,121,1) 100%);
                                border-radius: 7px;
                                color: white;
                                border: none;
                                cursor: pointer;
                                position:relative;
                                left:70px;
                        ">Répondre
                     </a>

                    <div style="margin-top:15px">
                        <p>A bientôt,</p>
                        <p>Votre équipe</p>
                    </div>
                </div>`




    const mailOptions = createOption(email, nameInitialisateur, html, title)

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info)
        if (info.messageId) {
            return { success: true, message: `L'email de proposition du rendez-vous a été envoyé au destinataire ${email} avec succès.` }
        }
    } catch (err) {
        return { success: false, message: "Erreur survenue avec le serveur." }
    }
}
