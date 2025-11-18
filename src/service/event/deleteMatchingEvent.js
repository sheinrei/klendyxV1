import { matchingEventTable } from "../../models/matchingEventTable.js";


export async function deleteMatchingEvent(db, token) {

    const Event = matchingEventTable(db);

    const deletedEvent = await Event.destroy({
        where: {
            token: token
        }
    })

    if (deletedEvent) {
        return { success: true, message: "Event archivé" }
    }

    return { success: false, message: "Echec lors de la suppression du matchingEvent." }

}