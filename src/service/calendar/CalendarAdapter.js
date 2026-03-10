


/**
 * Classe de base définissant le contrat que Ttous les adapters doivent respecter
 */
class CalendarAdapter {

    /** 
     * Création d'un nouvel évènement
     * @param {Object} eventData - { title, dateStart, dateEnd, description }
     * @returns {Promise<Object>} L'événement créé
     */
    async createEvent(eventData) {
        throw new Error('createEvent() doit être implémentée');
    }

    /**
     * Mise à jour un événement
     * @param {object} eventData - { title, dateStart, dateEnd, description }
     * @param {string} idEvent - L'id de l'evenement à mettre à jour
     * @returns {Promise<Object>} {Success: boolean, message : string}
     */
    async updateEvent(eventData, idEvent) {
        throw new Error('updateEvent() doit être implémentée');
    }

    /**
     * Récupère tout les évènements d'un provider
     * @returns {Promise<Object>} {success:boolean, message:string, data : object}
     */
    async getAllEvents() {
        throw new Error('getAllEvents() doit être implémentée');
    }

    /**
     * Supprime un événement depuis son id  
     * @param {string} idEvent 
     * @returns {Promise<Object>} {Success: boolean, message : string}
     */
    async deleteEvent(idEvent) {
        throw new Error('deleteEvent() doit être implémentée');
    }

    /**
     * Normalisation des données event
     * @param {*} eventData - Data brut reçu par la réponse api
     * @returns {object} {eventId: string , title:string, description:string , dateStart: date, dateEnd:date, provider:string}
     */
    _normalizeOutput(eventData) {
        throw new Error("_normalizeOutput doit être implémenté")
    }
}


export default CalendarAdapter;