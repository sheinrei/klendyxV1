import * as msal from "@azure/msal-node";
import { getToken } from "../../token/getToken.js";
import CalendarAdapter from '../CalendarAdapter.js';

class OutlookAdapter extends CalendarAdapter {

    constructor(db, userId) {
        super();
        this.db = db;
        this.userId = userId;
        this.graphApiUrl = "https://graph.microsoft.com/v1.0";

        this.cca = new msal.ConfidentialClientApplication({
            auth: {
                clientId: process.env.OUTLOOK_CLIENT_ID,
                authority: "https://login.microsoftonline.com/common",
                clientSecret: process.env.OUTLOOK_CLIENT_SECRET
            }
        });
    }


    async getToken() {
        const outlookSync = await getToken("OutlookSync", this.userId, this.db);
        if (!outlookSync) {
            throw new Error("Compte Outlook non synchronisé");
        }

        try {
            // On restaure le cache MSAL depuis la BDD
            this.cca.getTokenCache().deserialize(JSON.stringify({
                Account: outlookSync.totalToken.account,
                AccessToken: outlookSync.totalToken.accessToken,
                RefreshToken: outlookSync.totalToken.refreshToken,
                IdToken: {}
            }));

            // On récupère tous les comptes
            const accounts = await this.cca.getTokenCache().getAllAccounts();
            if (!accounts.length) throw new Error("Aucun compte trouvé dans le cache MSAL");

            // On fait la requête silent
            const silentRequest = {
                account: accounts[0],
                scopes: ["User.Read", "Calendars.ReadWrite"]
            };

            const response = await this.cca.acquireTokenSilent(silentRequest);
            return response.accessToken;

        } catch (err) {
            console.log("Refresh impossible de Outlook");
            throw new Error("Reconnexion Outlook requise");
        }
    }






    async createEvent(eventData) {
        try {
            const accessToken = await this.getToken();

            const event = {
                subject: eventData.title,
                body: {
                    contentType: "HTML",
                    content: eventData.description || ""
                },
                start: {
                    dateTime: eventData.startDate,
                    timeZone: "Europe/Paris"
                },
                end: {
                    dateTime: eventData.endDate,
                    timeZone: "Europe/Paris"
                }
            };

            const response = await fetch(`${this.graphApiUrl}/me/events`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Outlook API Error: ${error.error?.message || response.statusText}`);
            }

            const createdEvent = await response.json();

            return createdEvent;

        } catch (err) {
            throw new Error(`Erreur lors de la création d'un événement Outlook : ${err.message}`);
        }
    }


    async getAllEvents() {
        try {
            const accessToken = await this.getToken();

            let url = `${this.graphApiUrl}/me/events`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Erreur avec l'api Outlook: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const eventArray = [];
            data.value.forEach(event => {
                eventArray.push(this._normalizeOutput(event))
            });


            return {
                success: true,
                message: "La liste de tout les évènements Google a été récupéré avec succès",
                data: {
                    events: eventArray,
                    count: eventArray.length,
                    origin: "outlook"
                }
            }

        } catch (err) {
            throw new Error(`Erreur lors de la récupération des événements Outlook : ${err.message}`);
        }
    }


    async updateEvent(idEvent, eventData) {
        try {
            const accessToken = await this.getToken();

            const updateEvent = {
                subject: eventData.title,
                body: {
                    contentType: "HTML",
                    content: eventData.description || ""
                },
                start: {
                    dateTime: eventData.dateStart,
                    timeZone: "Europe/Paris"
                },
                end: {
                    dateTime: eventData.dateEnd,
                    timeZone: "Europe/Paris"
                }
            };

            const response = await fetch(`${this.graphApiUrl}/me/events/${idEvent}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateEvent)
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Événement non trouvé");
                }
                const error = await response.json();
                throw new Error(`Outlook API Error: ${error.error?.message || response.statusText}`);
            }

            const updatedEvent = await response.json();
            return this._normalizeOutput(updatedEvent);

        } catch (err) {
            throw new Error(`Erreur lors de la mise à jour d'un événement Outlook : ${err.message}`);
        }
    }


    async deleteEvent(eventId) {
        try {
            const accessToken = await this.getToken();
            const response = await fetch(`${this.graphApiUrl}/me/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Événement non trouvé");
                }
                const error = await response.json();
                throw new Error(`Outlook API Error: ${error.error?.message || response.statusText}`);
            }

            return {
                success: true,
                message: "Événement Outlook supprimé avec succès"
            };

        } catch (err) {
            throw new Error(`Erreur lors de la suppression d'un événement Outlook : ${err.message}`);
        }
    }


    _normalizeOutput(eventData) {
        return {
            eventId: eventData.id,
            title: eventData.subject,
            description: eventData.body?.content || "",
            dateStart: eventData.start.dateTime,
            dateEnd: eventData.end.dateTime,
            provider: "outlook",
        };

    }
}

export default OutlookAdapter