import { klendyxPropositionRdvTable } from "../../models/klendyxPropositionRdvTable.js";


export async function updatePropositionRdv(req, db) {
    const Table = klendyxPropositionRdvTable(db);

    const { responseUser,
        message,
        id,
        idEvent } = req.body;

    const update = await Table.update({
        recipientReponse: responseUser,
        recipientComment: message,
        state: "Repondu"
    },
        { where: { userId: id, id: idEvent } }
    )
    if (!update) {
        return { success: false, message: "Erreur Serveur, merci de réessayer plus tard." }
    }
    return {
        success: true,
        data: update,
        message: "Merci pour votre réponse, la notification a bien été prise en compte.\nUn message sera envoyé à l'initialisateur de la demande pour indiquer votre réponse."
    }
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