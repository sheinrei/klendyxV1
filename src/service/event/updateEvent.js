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
        state: "reponse saisi par le destinataire."
    },
        { where: { userId: id, id: idEvent } }
    )


    if (!update) {
        return { success: false, message: "Erreur Serveur, merci de réessayer plus tard." }
    }

    return { success: true, message: "Notification prise en compte." }
}