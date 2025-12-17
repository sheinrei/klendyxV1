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

            if (!create) {
                return {
                    success: false,
                    message: "Une erreur est survenue lors de la création du rendez-vous "
                }
            }
            return {
                success: true,
                message: "Le nouvel évènement a été ajouté dans votre agenda klendyx avec succès.",
                data: create
            }


        } catch (err) {
            throw new Error(`Erreur lors de la création d'un Event Klendyx :  ${err.message}`)
        }
    }



    async updateEvent(eventData, idEvent) {
        try {
            const [update] = this.Model.update(
                eventData,
                { where: { userId: this.userId, id: idEvent } })

            if (update === 0) {
                return {
                    success: false,
                    message: "Une erreur est survenue lors de la mise à jour de l'event"
                }
            }

            return {
                success: true,
                message: "L'évènement a été mis à jour avec succès",
            }
        } catch (err) {
            throw new Error(`Erreur lors de l'update d'un Event Klendyx : ${err.message}`)
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


    _normalizeOutput(eventData){
        return {
            eventId : eventData.id,
            title : eventData.summary,
            description : eventData.describe || "",
            dateStart : eventData.hourStart,
            dateEnd : eventData.hourEnd,
            provider : "klendyx",
        }
    }
}

export default KlendyxAdapter