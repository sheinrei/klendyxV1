import { eventTable } from "./../../models/eventTable.js";


export async function updateEvent(req, db) {

    const Table = eventTable(db);

    const { responseUser,
        message,
        id,
        idEvent } = req.body;

    const update = await Table.update({
        response: responseUser,
        messageReturn: message,
        state: "Repondu"
    },
        { where: { userId: id, id: idEvent } }
    )


    if (!update) {
        return { success: false, message: "Erreur Serveur, merci de réessayer plus tard." }
    }

    return { success: true, message: "Notification prise en compte." }
}



export async function updateStateEvent(userId, idEvent, db, state) {
    
    const Table = eventTable(db);

    const update = Table.update({
        state: state,
    },
        {
            where: { userId: userId, id: idEvent }
        })

    if (!update) {
        return { success: false, message: "Erreur Serveur, merci de réessayer plus tard." }
    }

    return { success: true, message: "Notification prise en compte." }
}