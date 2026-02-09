import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import db from "./../sequelize.js";
import { getAllEvents, createEvent, updateEvent, deleteEvent, getCalendarSync, revokeCalendar } from "../service/calendar/CalendarController.js";

const routerApiCalendar = express.Router()







routerApiCalendar.post("/get-events", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const provider = req.body.provider;

        const events = await getAllEvents(provider, db, userId)

        return res.json({
            success: events.success,
            data: events.data,
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Une erreur est survenue lors de la récupération des évènements, veuillez réessayer plus tard, si le problème persiste merci de contacter notre support",
            error: err.message
        })
    }
})




routerApiCalendar.post("/create", authMiddleware, async (req, res) => {

    try {
        const userId = req.userId;
        const provider = req.body.provider;
        const eventData = req.body.eventData;
        const createdEvent = await createEvent(provider, db, userId, eventData)

        return res.json({
            success: createdEvent.success,
            message: createdEvent.message,
            data: createdEvent.data,
        })

    } catch (err) {
        console.log(`Erreur survenue lors de la création d'un event avec provider ${provider}, message d'erreur : ${err.message}`);
        return res.status(500).json({
            success: false,
            message: "Une erreur est survenue lors de la création de l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter notre support",
            error: err.message
        })
    }

})

routerApiCalendar.post("/update", authMiddleware, async (req, res) => {
    try {

        const userId = req.userId;
        const eventData = req.body.eventData;
        const provider = req.body.provider;
        const eventId = req.body.eventId;


        const updatedEvent = await updateEvent(provider, db, userId, eventData, eventId)
        return res.json({
            success: updatedEvent.success,
            message: updatedEvent.data.message
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Une erreur est survenue lors de la mise à jour de l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter notre support",
            error: err.message
        })
    }
})



routerApiCalendar.post("/delete", authMiddleware, async (req, res) => {
    try {

        const userId = req.userId;
        const provider = req.body.provider;
        const eventId = req.body.eventId;

        const deletedEvent = await deleteEvent(provider, db, userId, eventId)

        console.log(eventId)
        return res.json({
            success: deletedEvent.success,
            data: deletedEvent.data,
            error: deletedEvent.error || null
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Une erreur est survenue lors de la suppression de l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter notre support",
            error: err.message
        })
    }
})

routerApiCalendar.get("/all-sync", authMiddleware, async (req, res) => {

    try {
        const synchronisation = await getCalendarSync(db, req.userId);
        return res.json(synchronisation)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Une erreur est survenue lors de la suppression de l'évènement, veuillez réessayer plus tard, si le problème persiste merci de contacter notre support",
            error: err.message
        })
    }
})

routerApiCalendar.post("/revoke-sync", authMiddleware, async (req, res) => {
    try {

        const provider = req.body.provider;
        const userId = req.userId;

        const revoke = await revokeCalendar(provider, db, userId);

        return res.json(revoke)

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Une erreur est survenue lors de la suppression de la synchronisation avec votre agenda ${provider} , veuillez réessayer plus tard, si le problème persiste merci de contacter notre support`,
            error: err.message
        })
    }
})
export default routerApiCalendar