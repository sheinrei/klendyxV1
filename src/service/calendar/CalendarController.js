import { deleteTokenSyncCalendar } from "../token/deleteToken.js";
import { getToken } from "../token/getToken.js";
import { getCalendarAdapter } from "./CalendarFactory.js";



export async function getAllEvents(provider, db, userId) {
    try {

        const adapter = getCalendarAdapter(provider, db, userId)
        const allEvents = await adapter.getAllEvents();

        return {
            data : allEvents
        }

    } catch (err) {
        return {
            success: false,
            message: "erreur survenue lors de la récupération des évènements, veuillez réessayer plus tard, si le problème persiste merci de contacter le support",
            error: err.message
        }
    }
}


export async function createEvent(provider, db, userId, eventData) {
    try {

        const adapter = getCalendarAdapter(provider, db, userId)
        const event = await adapter.createEvent(eventData)

        return {
            success: true,
            data: event
        }
    } catch (err) {
        return {
            success: false,
            message: "erreur survenue lors de la création de l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter le support",
            error: err.message
        }
    }
}


export async function updateEvent(provider, db, userId, eventData, eventId) {
    try {

        const adapter = getCalendarAdapter(provider, db, userId)
        const eventUpdated = await adapter.updateEvent(eventData, eventId);

        return {
            success: true,
            data: eventUpdated
        }
    } catch (err) {
        return {
            success: false,
            message: "erreur survenue lors de la mise à jour de l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter le support",
            error: err.message
        }
    }
}


export async function deleteEvent(provider, db, userId, eventId) {
    try {

        const adapter = getCalendarAdapter(provider, db, userId);
        const eventDeleted = await adapter.deleteEvent(eventId);

        return {
            success: true,
            data: eventDeleted
        }
    } catch (err) {
        return {
            success: false,
            message: "erreur survenue lors de la suppression de  l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter le support",
            error: err.message
        }
    }
}


export async function getCalendarSync(db, userId) {
    try {
        const google = await getToken("GoogleSync", userId, db);
        const outlook = await getToken("OutlookSync", userId, db);

        return {
            google: {
                sync: google.success,
                createdAt: google.createdAt || null
            },
            outlook: {
                sync: outlook.success,
                createdAt: outlook.createdAt || null
            },
            klendyx: true,
            apple: {
                sync: false,
                createdAt: null
            }
        }
    } catch (err) {
        return {
            success: false,
            message: "erreur survenue lors de l'analyse de synchronisation des comptes Calendar, veuillez réessayer plus tard, si le problème persiste merci de contacter le support",
            error: err.message
        }
    }
}


export async function revokeCalendar(provider, db, userId) {

    try {
        const deletedToken = await deleteTokenSyncCalendar(db, userId, provider)

        return {
            success : deletedToken.success,
            message : deletedToken.message
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: `"Une erreur est survenue lors de la suppression de la synchronisation avec votre agenda ${provider} , veuillez réessayer plus tard, si le problème persiste merci de contacter notre support`,
            error: err.message
        }
    }



}