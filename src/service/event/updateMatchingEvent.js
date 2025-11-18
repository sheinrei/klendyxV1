import { matchingEventTable } from "../../models/matchingEventTable.js";

export async function updateMatchingEvent(db, req) {
    try {
        const MatchingEvent = matchingEventTable(db);
        const updated = await MatchingEvent.update({
            undisponibility: req.body.undisponibility
        },
            { where: { token: req.body.token } })
        //Si mis à jours on get l'event pour le return avec la data
        if (updated) {
            const event = await MatchingEvent.findOne({ where: { token: req.body.token } })
            return { success: true, message: "Evenement mis à jour.", data: event }
        }

    } catch (err) {
        console.log(err)
        return { success: false, message: err }
    }
    return { success: false, message: "Erreur serveur survenu." }
}


export async function addRevolveMatchingEvent(db, resolvMatching, req) {
    try {
        const MatchingEvent = matchingEventTable(db);
        const updated = MatchingEvent.update({
            resolve: resolvMatching,
        }, {
            where: { token: req.body.token }
        })

        if (updated) {
            return { success: true, message: "Evenement mis à jour."}
        }
        return { success: false, message: "Erreur serveur survenu." }

    } catch (err) {
        console.log(err)
        return { succcess: false, message: "Erreur serveur survenu", err }
    }
}