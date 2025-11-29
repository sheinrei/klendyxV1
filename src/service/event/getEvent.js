import { eventRdvCalendyxTable } from "../../models/eventRdvCalendyxTable.js";



export async function getEvent(db, req) {

    const userId = req.userId
    const Event = eventRdvCalendyxTable(db);

    const data = await Event.findAll({ where: { userId: userId } })

    if (!data) {
        return { success: false, message: "Echec lors de la recuperation des events" }
    }
    return { success: true, data }

}