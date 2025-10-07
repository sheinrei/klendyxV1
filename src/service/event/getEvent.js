import { eventTable } from "../../models/eventTable.js";



export async function getEvent(db, req) {

    const userId = req.userId
    const Event = eventTable(db);

    const data = await Event.findAll({ where: { userId: userId } })

    if (!data) {
        return { success: false, message: "Echec lors de la recuperation des events" }
    }
    return { success: true, data }

}