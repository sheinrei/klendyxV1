import { rappelRdvTable } from "../../models/rappelRdvTable.js";



export async function createRappelRdv(db, idUser, phone, email, method, dayEvent, timeBefore, message) {

    const Table = rappelRdvTable(db)
    console.log(method)
    const create = await Table.create({
        idUser,
        phone,
        email,
        method,
        dayEvent,
        timeBefore,
        message,

    })

    if (!create)return ({success:false, message : "Echec lors de la création du rappel de rendez-vous"})

        return ({success: true, message : "Rappel de rendez-vous créé avec succes"})
}