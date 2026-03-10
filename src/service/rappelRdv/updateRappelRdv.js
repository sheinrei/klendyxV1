import { rappelRdvTable } from "../../models/rappelRdvTable.js";


export async function updateRappelRdv(id, data, db) {

    try {

        const Table = rappelRdvTable(db);
        const [updated] = await Table.update(
            data,
            {where : {id}}
        )

        return updated > 0
        ? {
            success: true,
            message : "Le rappel de rdv a été mis à jour avec succes"
        }
        : {
            success: false,
            message : "Aucun rappel de rendez-vous n'as été mis à jours en base de donnée"
        }

    } catch (err) {
        console.warn(`Echec lors de la mise a jours d'un rappel de rendez-vous, error : ${err}`)
        return {
            success: false,
            message: "Echec lors de la mise a jours d'un rappel de rendez-vous",
            error: err
        }
    }
}