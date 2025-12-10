import { klendyxPropositionRdvTable } from "../../models/klendyxPropositionRdvTable.js";


export async function deleteEvent(db, req) {

    const Event = klendyxPropositionRdvTable(db);
    const userId = req.userId;
    const idEvent = req.body.eventId;

    const deletedEvent = await Event.destroy({
        where: {
            userId: userId,
            id: idEvent
        }
    })

    if (deletedEvent) {
        return { success: true, message: "Event archivé" }
    }

}