


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

    /**
     * Normalise la sorti des données events
     */
    _normalizeOutput(eventData) {
        throw new Error("_normalizeOutput doit être implémenté")
    }

    /**
     * Relance une opération si une erreur survient
     * @param {*} fn 
     * @param {*} maxRetry 
     * @param {*} delayMs 
     * @returns 
     */

    async retryOperation(fn, maxRetry = 3, delayMs = 500) {
        for (let attempt = 0; attempt < maxRetry; attempt++) {
            try {
                return await fn();
            } catch (err) {
                // définir ici les erreurs retryables
                console.log("erreur survenue dans le retry")
                const retryable = err.code === "ETIMEDOUT" ||
                    err.code === "ECONNRESET" ||
                    err.message.includes("timeout") ||
                    err.message.includes("5xx") ||
                    err.message.includes("401") ||
                    err.message.includes("412");

                if (attempt < maxRetry && retryable) {
                    console.warn(`Tentative ${attempt} échouée, retry dans ${delayMs}ms...`);
                    await new Promise(r => setTimeout(r, delayMs));
                    continue;
                }
                throw err;
            }
        }
    }
}

export default CalendarAdapter;