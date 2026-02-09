import { klendyxPropositionRdvTable } from "../../models/klendyxPropositionRdvTable.js";


export async function createKlendyxPropositionRdv(db, req) {

    const userId = req.userId;
    const Event = klendyxPropositionRdvTable(db)


    if (!userId) return { success: false, message: "Utilisateur introuvable, merci de vous connecter" }

    const { nom, prenom,
        email, phone,
        dayStart, hourStart, hourEnd,
        title, commentaire,
        methodContactSms, methodContactEmail,
        rappel } = req.body;

    try {
        const create = await Event.create({
            userId,
            methodContactSms,
            methodContactEmail,
            recipientPhone: phone,
            recipientEmail: email,
            recipientName: `${nom} ${prenom}`,
            title,
            commentaire,
            dayStart,
            hourStart,
            hourEnd,
            rappel,
            state: "En attente de réponse"
        })

        if (!create) {
            return { success: false, message: "Une erreur est survenu lors de la création de la proposition de rendez-vous " }
        }

        return { success: true, message: "Proposition de rendez-vous créé avec success", create }
    } catch (err) {
        console.log(err)
    }
}