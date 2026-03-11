import { matchingEventTable } from "../../models/matchingEventTable.js";


export async function getMatchingEvent(db, token) {

    try {
        const Event = matchingEventTable(db);
        const data = await Event.findOne({ where: { token: token } })

        if (!data) {
            return {
                success: false,
                message: "Echec lors de la recuperation de l'event."
            }
        }

        return { success: true, data }

    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: process.env.MESSAGE_ERREUR_SERVEUR,
            error: err.message
        }
    }

}

export async function getAllMatchingEvent(db, userId) {

    try {
        const Event = matchingEventTable(db);
        const allEvent = await Event.findAll({
            where: { userId: userId }
        })

        return {
            matchingrdv: allEvent
        }

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: process.env.MESSAGE_ERREUR_SERVEUR,
            error: err.message
        }
    }
}