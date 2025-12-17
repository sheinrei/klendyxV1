


/**
 * Classe de base définissant le "contrat" 
 * que TOUS les adapters doivent respecter
 */


class CalendarAdapter {

    /**
     * Crée un événement
     * @param {Object} eventData - { title, dateStart, dateEnd, description }
     * @returns {Promise<Object>} L'événement créé
     */
    async createEvent(eventData) {
        throw new Error('createEvent() doit être implémentée');
    }


    /**
     * Met à jour un événement
     * @param {*} eventData - { title, dateStart, dateEnd, description }
     * @param {*} idEvent 
     * 
     */
    async updateEvent(eventData, idEvent) {
        throw new Error('updateEvent() doit être implémentée');
    }


    /**
     * Récupère tous les événements du provider
     */
    async getAllEvents() {
        throw new Error('getAllEvents() doit être implémentée');
    }


    /**
     * Supprime un événement depuis son id
     */
    async deleteEvent(idEvent) {
        throw new Error('deleteEvent() doit être implémentée');
    }
}

export default CalendarAdapter;