import { klendyxPropositionRdvTable } from "../../models/klendyxPropositionRdvTable.js";



export async function getAllPropositionRdv(db, req) {

    const userId = req.userId
    const Event = klendyxPropositionRdvTable(db);

    const data = await Event.findAll({ where: { userId: userId } })

    if (!data) {
        return { success: false, message: "Echec lors de la recuperation des events" }
    }
    return { success: true, data }

}

export async function getPropositionRdvById(db, req) {
    
    const Event = klendyxPropositionRdvTable(db);
    const userId = req.body.id
    const idEvent = req.body.idEvent;

    const data = await Event.findOne({ where: { userId: userId , id : idEvent} })

    if (!data) {
        return { success: false, message: "Aucune proposition de rendez-vous trouvé." }
    }
    return { success: true, data }
}