import { rappelRdvTable } from "../../models/rappelRdvTable.js";
import { getUserData } from "../user/getUserData.js";


export async function createRappelRdv(db, userId, phone, email, method, dayEvent, timeBefore, hourStart, hourEnd, nom, prenom) {


    const dataUser = await getUserData(db, userId);
    const nameInitialisateur = dataUser.nom + " " + dataUser.prenom;


    console.log(dayEvent)
    const date = new Date(`${dayEvent}`)
    const dayStartFr = date.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })

    const message = `Bonjour ${prenom}.\n Nous vous rappelons votre rendez-vous avec ${nameInitialisateur} le ${dayStartFr} de ${hourStart.replace(":", "h")} à ${hourEnd.replace(":", "h")}`

    console.log("Message à envoyer pour le rappel de rendez-vous")

    const Table = rappelRdvTable(db)
    const create = await Table.create({
        userId,
        phone,
        email,
        method,
        dayEvent,
        timeBefore,
        message,
        recipientPrenom: prenom,
        recipientNom: nom
    })

    if (!create) return ({ success: false, message: "Echec lors de la création du rappel de rendez-vous" })

    return ({
        success: true,
        message: "Le rappel de rendez-vous à été créé avec succès.",
        id: create.id,
        state : create.state,
        dayEvent : create.dayEvent
    })
}