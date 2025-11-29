import { Sequelize } from "sequelize";
import { eventRdvCalendyxTable } from "../../models/eventRdvCalendyxTable.js";


/**
 *  La req doit contenir : idUser :integer, 
 *  type : string,
 *  recipient : string,
 *  content : string
 * @param {Sequelize} db 
 * @param {*} req 
 * @returns 
 */

export async function createEvent(db, req) {

    let {
        recipientName,
        plateformSender,
        recipientContactEmail,
        recipientContactSms,
        dateDebut,
        dateFin,
        titleEvent,
        messageEvent,
    } = req.body

    const userId = req.userId;

    const Event = eventRdvCalendyxTable(db)

    if (!userId) return { success: false, message: "Utilisateur introuvable, merci de vous connecter" }
    if (!recipientName) return { success: false, message: "Nom du client inconnu merci de le saisir" }
    if (!titleEvent) return { success: false, message: "Motif de rendez-vous introuvable, merci de le saisir" }
    if (!messageEvent) return { success: false, message: "Message de rendez-vous introuvable, merci de le saisir" }
    if (!dateDebut || !dateFin) return { success: false, message: "Date manquante" }



    plateformSender = JSON.stringify(plateformSender)

    try {
        const create = await Event.create({
            userId,
            plateformSender,
            recipientName,
            recipientContactEmail,
            recipientContactSms,
            titleEvent,
            messageEvent,
            dateDebut,
            dateFin,
        })

        if (!create) {
            return { success: false, message: "Une erreur est survenu impossible de l'event " }
        }

        return { success: true, message: "Evenement créé avec succès, rendez-vous dans votre espace Tableau de bord pour voir l'avancé", create }
    } catch (err) {
        console.log(err)
    }
}