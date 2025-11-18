import { matchingEventTable } from "../../models/matchingEventTable.js";
import crypto from "crypto";


export async function createMatchingEvent(db, req) {

    const MatchingEvent = matchingEventTable(db);

    const token = crypto.randomBytes(32).toString("hex")



    const create = MatchingEvent.create({
        idUser: req.userId,
        eventTitle: req.body.eventTitle,
        description: req.body.description,
        eventAddress: req.body.eventAddress ?? null,
        contact: req.body.contact,

        rangeStart: req.body.rangeStart,
        rangeEnd: req.body.rangeEnd,

        rangeHoursStart: req.body.rangeHoursStart,
        rangeHoursEnd: req.body.rangeHoursEnd,
        durationEvent: req.body.durationEvent,
        undisponibility: req.body.undisponibility,
        token: token
    })

    if (!create) {
        return { success: false, message: "Une erreur est survnu impossible de créer l'event" }
    }

    return { success: true, message: "Evenement créé avec succès.", token }
}