import { createDAVClient } from "tsdav";
import { v4 as uuidv4 } from 'uuid';
import CalendarAdapter from '../CalendarAdapter.js';
import { getToken } from "../../token/getToken.js";
import { decrypt } from "../../chiffrement.js";



class AppleAdapter extends CalendarAdapter {

    constructor(db, userId) {
        super()
        this.userId = userId;
        this.db = db;
    }


    async createClient() {
        const appleUrl = "https://caldav.icloud.com"

        try {
            const token = await getToken("AppleSync", this.userId, this.db);
            const email = token.totalToken.email;
            const passwordEncrypted = token.totalToken.password;
            const password = decrypt(passwordEncrypted);



            return await createDAVClient({
                serverUrl: process.env.ENV == "dev" ? 'http://localhost:5232/' : appleUrl,
                credentials: {
                    username: email, //beaute.laurent.dev@gmail.com necessite id apple
                    password: password,
                },
                authMethod: 'Basic',
                defaultAccountType: 'caldav',

            });
        } catch (err) {
            console.log(err)
            throw new Error(`Echec lors de la creation du client calDav erreur : ${err.message}`)
        }
    }

    formatICalDate(date) {
        const dateParse = new Date(date)
        return dateParse.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    icsToDate(str) {
        // 20260105T151904Z -> 2026-01-05T15:19:04Z
        return new Date(
            str.replace(
                /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
                '$1-$2-$3T$4:$5:$6Z'
            )
        );
    }


    async getAllEvents() {
        try {
            const client = await this.createClient();
            const calendars = await client.fetchCalendars();
            const calendar = calendars[0]
            const events = await client.fetchCalendarObjects({ calendar });

            const eventsNormalized = [];
            events.forEach(event => {
                eventsNormalized.push(this._normalizeOutput(event))
            })
            return {
                success: true,
                message: "La liste de tout les évènements Apple a été récupéré avec succès",
                data: {
                    events: eventsNormalized,
                    count: events.length,
                    origin: "apple"
                }
            }
        } catch (err) {
            console.log("Erreur lors de la recupertion des events", err)
            throw new Error(`Erreur lors de la récupération des évènements apple : ${err.message}`)
        }
    }


    async createEvent(eventData) {
        console.log("created event , eventData : ", eventData)
        try {
            const client = await this.createClient()
            const eventId = uuidv4();



            const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Klendyx//CalDAV Test//EN
BEGIN:VEVENT
UID:${eventId}
DTSTAMP:${this.formatICalDate(new Date())}
DTSTART:${this.formatICalDate(eventData.dateStart)}
DTEND:${this.formatICalDate(eventData.dateEnd)}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
LOCATION:Bureau
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;





            let calendars = await client.fetchCalendars();
            const createdEvent = await client.createCalendarObject({
                calendar: calendars[0],
                filename: `${eventId}.ics`,
                iCalString: icsData
            })
            console.log("createdEvent : ", createdEvent)
            return {
                success: true,
                message: "L'évènement a été ajouté dans votre agenda Apple avec succès.",
                eventId,
            }

        } catch (err) {
            throw new Error(`Erreur lors de la création d'évènement apple : ${err.message}`)
        }
    }

    async updateEvent(eventData, eventId) {
        try {

            const client = await this.createClient();
            const calendars = await client.fetchCalendars();
            const calendar = calendars[0];

            const events = await client.fetchCalendarObjects({ calendar });
            const eventToUpdate = events.find(event => event.url.includes(eventId));

            console.log(eventToUpdate)
            if (!eventToUpdate) {
                console.log(`Événement ${eventId} non trouvé`);
                return {
                    success: false,
                    message: `Événement ${eventId} non trouvé`
                }
            }
            let icsData = eventToUpdate.data;

            console.log("les data que l'on a récupéré sur l'event à update : ", icsData);

            icsData = icsData.replace(/DTSTAMP:.*\r?\n/, `DTSTAMP:${this.formatICalDate(new Date())}\r\n`);

            if (eventData.title) {
                icsData = icsData.replace(/SUMMARY:.*\r?\n/, `SUMMARY:${eventData.title}\r\n`);
            }
            if (eventData.description) {
                icsData = icsData.replace(/DESCRIPTION:.*\r?\n/, `DESCRIPTION:${eventData.description}\r\n`);
            }
            if (eventData.dateStart) {
                icsData = icsData.replace(/DTSTART:.*\r?\n/, `DTSTART:${this.formatICalDate(eventData.dateStart)}\r\n`);
            }
            if (eventData.dateEnd) {
                icsData = icsData.replace(/DTEND:.*\r?\n/, `DTEND:${this.formatICalDate(eventData.dateEnd)}\r\n`);
            }

            console.log("le fichier ics modifié  ", icsData)

            const eventUpdated = await client.updateCalendarObject({
                calendar,
                calendarObject: {
                    url: eventToUpdate.url,
                    etag: eventToUpdate.etag
                },
                iCalString: icsData,
                headers: {
                    "If-Match": eventToUpdate.etag
                }
            })

            if (eventUpdated.status < 200 && eventUpdated.status >= 300) {
                return {
                    success: false,
                    message: "Un problème et survenue, l'évènement n'as pas pu être mis à jour.",
                    error: "Réponse status non OK :" + eventToUpdate.status
                }
            }

            return {
                success: true,
                message: "L'évènement a été mis à jour avec succès."
            }

        } catch (err) {
            console.log(`Erreur lors de la mise à jour d'évènement apple : ${err.message}`)
            return {
                success: false,
                message: process.env.MESSAGE_ERREUR_SERVEUR,
                error: err.message || err
            }

        }
    }

    async deleteEvent(idEvent) {
        try {
            const client = await this.createClient();
            const calendars = await client.fetchCalendars();
            const calendar = calendars[0];

            const events = await client.fetchCalendarObjects({ calendar });
            const eventToDelete = events.find(ev => ev.url.includes(idEvent));

            if (!eventToDelete) {
                return {
                    success: false,
                    message: "L'évènement selectionné n'existe pas dans votre agenda Apple.",
                    error: `Événement ${idEvent} non trouvé`,
                }
            }

            const deletedEvent = await client.deleteCalendarObject({ calendar, calendarObject: eventToDelete });

            if (deletedEvent.status < 200 && deletedEvent.status >= 300) {
                return {
                    success: false,
                    message: "Un problème et survenue, l'évènement n'as pas pu être supprimé.",
                    error: "Réponse status non OK:" + deletedEvent.status
                }
            }

            return {
                success: true,
                message: "L'évènement a été supprimé de votre agenda Apple avec succès"
            }

        } catch (err) {
            console.log(`Erreur lors de la suppression d'évènement apple : ${err.message || err}`)
            return {
                success: false,
                message: process.env.MESSAGE_ERREUR_SERVEUR,
                error: err.message || err
            }
        }
    }



    _normalizeOutput(eventData) {
        const lines = eventData.data.split(/\r?\n/)
        const event = {};

        lines.forEach(line => {
            const [key, ...rest] = line.split(":");
            const value = rest.join(":");
            if (key === "SUMMARY") event.title = value;
            if (key === "DESCRIPTION") event.description = value;
            if (key === "DTSTART") event.dateStart = this.icsToDate(value);
            if (key === "DTEND") event.dateEnd = this.icsToDate(value);
            if (key === "UID") event.eventId = value;
        })

        event.provider = "apple"
        return { ...event }

    }
}


export default AppleAdapter