import { matchingEventTable } from "../../models/matchingEventTable.js";


export async function getMatchingEvent(db, token) {

    try {        
        const Event = matchingEventTable(db);
        const data = await Event.findOne({ where: { token : token } })

        if (!data) {
            return { success: false, message: "Echec lors de la recuperation de l'event." }
        }

        return { success: true, data }

    } catch (err) {
        return console.log(err)
    }

}