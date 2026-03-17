async function getConfig() {
    try {
        const res = await fetch("/config");
        const data = await res.json();
        return {
            host: data.host,
        };
    } catch (err) {
        console.log(err)
    }
}


/**
 * Récupère les crédits actuel d'un utilisateur
 * @returns 
 */
export async function getCurrentCredit() {
    try {
        const config = await getConfig()
        const host = config.host

        const res = await fetch(`${host}/api/credit/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const credit = await res.json()

        return credit
    } catch (err) {
        return {
            success: false,
            message: "Une erreur est survenue avec le seveur, veuillez réessayer plus tard"
        }
    }
}


/**
 * Récupère les événements calendar d'un provider
 * @param {*} provider 
 * @returns 
 */
export async function getDataCalendar(provider) {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/calendar/get-events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ provider })
        })
        const data = await res.json()
        return data
    } catch (err) {
        console.log(err)
    }
}


/**
 * Get toute les propositions de rendez-vous
 * @returns 
 */
export async function getPropositionRdv() {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/rdv/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return data.event


    } catch (err) {
        console.log(err)
    }
}

export async function deletePropositionRdv(idEvent) {
    try {

        const host = await getConfig()
        const res = await fetch(`${host.host}/api/rdv/${idEvent}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return {
            success: data.success,
            message: data.message
        }
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Une erreur est survenue, nous n'avons pas pu supprimer cette proposition de rendez-vous, veuillez réssayer plus tard."
        }
    }
}

export async function updatePropositionRdv(dataDTO) {
    try {

        const host = await getConfig()
        const url = `${host.host}/api/rdv/${dataDTO.methodContactSms}/${dataDTO.methodContactEmail}/${dataDTO.recipientPhone}/${dataDTO.recipientEmail}/${encodeURIComponent(dataDTO.recipientName)}/${encodeURIComponent(dataDTO.title)}/${dataDTO.dayStart}/${dataDTO.hourStart}/${dataDTO.hourEnd}`;

        console.log(url)
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json()
        console.log(data)

    } catch (err) {
        console.error(err)
        return {
            success: false,
            message: "Une erreur est survenue, nous n'avons pas pu mettre à jour cette proposition de rendez-vous, veuillez réssayer plus tard."
        }
    }
}

/**
 * Get Tout les rappel de rendez-vous de l'utilisateur
 * @returns 
 */
export async function getAllRappelRdv() {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/rappel-rdv`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return data
    } catch (err) {
        console.warn(err)
    }
}


/**
 * 
 * @param {string} phone - phone du destinataire (format traité niveau backend)
 * @param {string} email - email du destinataire
 * @param {string} method - method d'envoie du rappel de rendez-vous
 * @param {Date} dayEvent - dateTime du rendez-vous
 * @param {number} timeBefore - nombre d'heure avant le rdv pour déclancher le rappel
 * @param {string} hourStart - Heure de début du rendez-vous
 * @param {string} hourEnd - Heure de fin du rendez-vous
 * @returns {Object} - json de la response api
 */
export async function createRappelRdv(phone, email, method, dayEvent, timeBefore, hourStart, hourEnd, nom, prenom) {
    try {
        const host = await getConfig()

        console.log(nom, prenom)

        const dateTimeEvent = `${dayEvent}T${hourStart}:00Z`
        console.log(dateTimeEvent)

        const res = await fetch(`${host.host}/api/rappel-rdv/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                phone,
                email,
                method,
                dayEvent: dateTimeEvent,
                timeBefore,
                hourStart,
                hourEnd,
                nom,
                prenom
            })
        })
        const data = await res.json()
        console.log("data retournée par l'api cration rappel : ", data)
        return {
            success: data.success,
            message: data.message,
            id: data.idEvent,
            state: data.state,
            dayEvent: data.dayEvent
        }
    } catch (err) {
        console.warn(err)
        return {
            success: false,
            message: "Une erreur est survenue, nous n'avons pas pu créer le nouveau rappel de rendez-vous."
        }
    }
}




/**
 * Supprime un rappel de rendez-vous
 * @param {number} id - id du rappel à supprimer 
 * @returns 
 */
export async function deleteRappel(id) {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/rappel-rdv/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(res.status)
        const data = await res.json()
        return data
    } catch (err) {
        console.warn(err)
    }
}


/**
 * Renvois la liste des calendars synchronisé 
 * @returns 
 */
export async function getSyncProvider() {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/calendar/all-sync`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return data
    } catch (err) {
        console.warn(err)
        return {
            success: false
        }
    }
}