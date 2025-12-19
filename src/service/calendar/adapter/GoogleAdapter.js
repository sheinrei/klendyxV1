import { getToken } from "../../token/getToken.js";
import CalendarAdapter from "../CalendarAdapter.js"
import { google } from "googleapis";


class GoogleAdapter extends CalendarAdapter {

    constructor(db, userId) {
        super()
        this.userId = userId;
        this.db = db;
        this.oauth2Client = new google.auth.OAuth2(
            process.env.O2AUTH_ID_CLIENT,
            process.env.O2AUTH_CLIENT_SECRET,
            `${process.env.HOST}/api/calendar/google/callback`
        );
        this.scope = ["https://www.googleapis.com/auth/calendar"];
        this.calendar = google.calendar({ version: "v3", auth: this.oauth2Client });

    }

    async setCredentials() {
        const token = await getToken("GoogleSync", this.userId, this.db);
        if (!token) {
            throw new Error(`Token google introuvable dans la base de donnée`)
        }
        this.oauth2Client.setCredentials({
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expiry_date: token.expiry_date,
        });
    }



    async createEvent(eventData) {
        try {
            await this.setCredentials()

            const event = {
                summary: eventData.summary,
                location: 'Google Meet',
                description: eventData.description,
                start: {
                    dateTime: eventData.dateStart,
                    timeZone: 'Europe/Paris',
                },
                end: {
                    dateTime: eventData.dateEnd,
                    timeZone: 'Europe/Paris',
                },
            };

            const eventRes = await this.calendar.events.insert({
                calendarId: "primary",
                resource: event,
            });

            return {
                success: true,
                message: "L'évènement a été ajouté dans votre agenda Google avec succès",
                eventId: eventRes.data.id,
                data: eventRes.data
            };



        } catch (err) {
            throw new Error(`Erreur lors de la création d'un évènement Google : ${err.message}`)
        }
    }



    async updateEvent(eventData, idEvent) {
        try {

            await this.setCredentials()

            const eventRes = await this.calendar.events.update({
                calendarId: "primary",
                eventId: idEvent,
                resource: {
                    summary: eventData.title,
                    description: eventData.describe,
                    start: { dateTime: eventData.dateStart, timeZone: 'Europe/Paris' },
                    end: { dateTime: eventData.dateEnd, timeZone: 'Europe/Paris' }
                }
            });

            return {
                success: true,
                message: "L'évènement Google a été mis à jour avec succès",
                data: eventRes.data
            };
        } catch (err) {
            throw new Error(`Erreur lors de la mise à jour d'un évènement Google : ${err.message}`)
        }
    }




    async getAllEvents() {

        try {
            await this.setCredentials();

            const now = new Date();
            const lastMounth = new Date(now);
            lastMounth.setDate(now.getDate() - 30);

            const option = {
                calendarId: "primary",
                timeMin: lastMounth.toISOString(),
                //timeMax: rangeMax ? new Date(rangeMax).toISOString() : undefined,
                fields: "items(id,summary,start,end, description)",
                maxResults: 400,
                singleEvents: true,
                orderBy: "startTime",
            }

            const events = await this.calendar.events.list(option);

            const arrayEvent = [];

            events.data.items.forEach(event => {
                arrayEvent.push(this._normalizeOutput(event))
            })
            return {
                success: true,
                message: "La liste de tout les évènements Google a été récupéré avec succès",
                data: {
                    events: arrayEvent,
                    count: arrayEvent.length,
                    origin: "google"
                }
            }
        }catch(err){
            console.log(err)
            return {
                success:false,
                message : "Une erreur est survenue et ne pouvons pas récupérer vos évènements de l'agenda google, veuillez réessayer plus tard. Si le problème persiste merci de contacter le support Klendyx.",
                error : err.message
            }
        }

    }




    async deleteEvent(idEvent) {
        try {
            await this.setCredentials()
            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: idEvent,
            })
            return {
                success: true,
                message: "L'évènement a été supprimé de votre agenda Google avec succès"
            }

        } catch (err) {
            throw new Error(`Erreur lors de la suppression d'un évènement Google : ${err.message}`)
        }
    }

    _normalizeOutput(eventData) {
        return {
            eventId: eventData.id,
            title: eventData.summary,
            description: eventData.description || "",
            dateStart: eventData.start.dateTime,
            dateEnd: eventData.end.dateTime,
            provider: "google",
        }
    }
}

export default GoogleAdapter