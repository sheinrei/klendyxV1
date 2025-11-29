import { eventRdvCalendyxTable } from "../../models/eventRdvCalendyxTable.js";


export async function deleteEvent(db, req) {

    const Event = eventRdvCalendyxTable(db);
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