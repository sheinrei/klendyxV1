import { deleteTokenSyncCalendar } from "../../token/deleteToken.js";
import { getToken } from "../../token/getToken.js";
import { updateToken } from "../../token/updateToken.js";
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
            throw new Error(`Token google introuvable dans la base de donnée`);
        }

        // Vérifie si le token est expiré
        const isExpired = !token.expiry_date || token.expiry_date <= Date.now();
        console.log("Validité du token :", isExpired)
        if (isExpired) {

            console.log("Access token expire refresh en cours")

            try {
                const { credentials } = await this.oauth2Client.refreshToken(token.refresh_token)
                const newToken = {
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token ?? token.refresh_token,
                    expiry_date: credentials.expiry_date ?? Date.now() + 3600 * 1000
                }
                await updateToken("GoogleSync", this.userId, newToken, this.db)

            } catch (error) {

                if (error.response?.data?.error === "invalid_grant") {

                    console.log("Refresh token invalide → reconnect Google nécessaire")

                    await deleteTokenSyncCalendar(this.db, this.userId, "google")

                    throw new Error("GOOGLE_RECONNECT_REQUIRED")
                }

                throw error
            }
            return;
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
                summary: eventData.title,
                location: 'Google Meet',
                description: eventData.description,
                start: {
                    dateTime: eventData.dateStart,
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: eventData.dateEnd,
                    timeZone: 'UTC',
                },
            }
            const eventRes = this.calendar.events.insert({
                calendarId: "primary",
                resource: event,
            });
            return {
                success: true,
                message: "L'évènement a été ajouté dans votre agenda Google avec succès.",
                eventId: eventRes.data.id,
            }
        } catch (err) {
            console.warn(`Une erreur est survenue lors de la création d'un event Google`)
            return {
                success: false,
                error: err,
            }
        }
    }



    async updateEvent(eventData, idEvent) {
        try {
            await this.setCredentials()

            const eventRes = this.calendar.events.update({
                calendarId: "primary",
                eventId: idEvent,
                resource: {
                    summary: eventData.title,
                    description: eventData.description,
                    start: { dateTime: eventData.dateStart, timeZone: 'Europe/Paris' },
                    end: { dateTime: eventData.dateEnd, timeZone: 'Europe/Paris' }
                }
            })

            if (!eventRes.status || eventRes.status < 200 || eventRes.status >= 300) {
                return {
                    success: false,
                    message: "Un incident est survenue, l'évènement google n'a pas pu être mis à jour"
                }
            }
            return {
                success: true,
                message: "L'évènement a été mis à jour dans votre agenda Google avec succès",
            };
        } catch (err) {
            return {
                success: false,
                message: process.env.MESSAGE_ERREUR_SERVEUR,
                code: err.message
            }
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
        } catch (err) {
            if (err?.response?.data?.error === 'invalid_grant') {
                console.log("access token revoke ")
                return {
                    success: false,
                    message: "synchronisation avec le compte Google a été rompu, veuillez resynchroniser votre compte."
                }
            }
            console.log(err)
            return {
                success: false,
                message: "Une erreur est survenue et ne pouvons pas récupérer vos évènements de l'agenda google, veuillez réessayer plus tard. Si le problème persiste merci de contacter le support Klendyx.",
                error: err.message
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
        const eventId = eventData.id;
        const title = eventData.summary;
        const description = eventData.description || "";
        const dateStart = new Date(eventData.start.dateTime);
        const dateEnd = new Date(eventData.end.dateTime);
        return {
            eventId,
            title,
            description,
            dateStart: dateStart.toISOString(),
            dateEnd: dateEnd.toISOString(),
            provider: "google",
        }
    }
}

export default GoogleAdapter