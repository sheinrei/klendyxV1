import { eventKlendyxTable } from "../../../models/eventKlendyxTable.js";
import CalendarAdapter from "../CalendarAdapter.js"


class KlendyxAdapter extends CalendarAdapter {

    constructor(db, userId) {
        super();
        this.db = db;
        this.Model = eventKlendyxTable(db);
        this.userId = userId
    }


    async createEvent(eventData) {
        try {
            const create = await this.Model.create({
                userId: this.userId,
                summary: eventData.title,
                describe: eventData.description,
                image: eventData.image ?? null,
                hourStart: eventData.dateStart,
                hourEnd: eventData.dateEnd,
                allDay: eventData.allDay ?? false,
            });

            console.log("creation de l'event klendyx :", create)
            if (!create) {
                return {
                    success: false,
                    message: "Une erreur est survenue lors de la création du rendez-vous "
                }
            }
            return {
                success: true,
                message: "Le nouvel évènement a été ajouté dans votre agenda klendyx avec succès.",
                eventId: create.id
            }


        } catch (err) {
            throw new Error(`Erreur lors de la création d'un Event Klendyx :  ${err.message}`)
        }
    }



    async updateEvent(eventData, idEvent) {
        try {
            const update = await this.Model.update(
                {
                    summary: eventData.title,
                    hourStart: eventData.dateStart,
                    hourEnd: eventData.dateEnd,
                    describe: eventData.description
                },
                { where: { userId: this.userId, id: idEvent } })

            if (update[0] === 0) {
                return {
                    success: false,
                    message: "Une erreur est survenue lors de la mise à jour de l'event"
                }
            }

            console.log(update)
            return {
                success: true,
                message: "L'évènement a été mis à jour avec succès",
            }
        } catch (err) {
            console.log(`Erreur lors de l'update d'un Event Klendyx : ${err.message}`)
            return {
                success: false,
                messgae: process.env.MESSAGE_ERREUR_SERVEUR,
                error: err.message || err
            }
        }
    }



    async getAllEvents() {
        try {
            const findAll = await this.Model.findAll({
                where: { userId: this.userId }
            })

            const eventArray = [];
            findAll.forEach(event => {
                eventArray.push(this._normalizeOutput(event))
            });

            return {
                success: true,
                message: "Tous les évènements Klendyx ont été récupéré avec succès",
                data: {
                    events: eventArray,
                    count: eventArray.length,
                    origin: "Klendyx"
                }
            }
        } catch (err) {
            throw new Error(`Erreur survenue lors de la récupération de tout les évènements Klendyx ! ${err.message}`)
        }
    }


    async deleteEvent(idEvent) {
        try {
            const destroy = await this.Model.destroy({
                where: { id: idEvent, userId: this.userId }
            })

            if (destroy) {
                return {
                    success: true,
                    message: "L'évènement Klendyx a été supprimé avec succès"
                }
            }
            return {
                success: false,
                message: "L'évènement Klendyx n'a pas pu être supprimé"
            }
        } catch (err) {
            throw new Error(`Erreur lors de la suppression de l'évènement Klendyx ! ${err.message}`)
        }
    }


    _normalizeOutput(eventData) {
        const eventId = eventData.id;
        const title = eventData.summary;
        const description = eventData.describe || "";
        const dateStart = new Date(eventData.hourStart.split(" ")[0] + "T" + eventData.hourStart.split(" ")[1] + "Z");
        const dateEnd = new Date(eventData.hourEnd.split(" ")[0] + "T" + eventData.hourEnd.split(" ")[1] + "Z")
        return {
            eventId,
            title,
            description,
            dateStart: dateStart.toISOString(),
            dateEnd: dateEnd.toISOString(),
            provider: "klendyx",
        }
    }
}

export default KlendyxAdapter