import { rappelRdvTable } from "../../models/rappelRdvTable.js";



export async function deleteRappelRdv(id, db) {
    try {
        const Table = rappelRdvTable(db)
        const deleted = await Table.destroy({
            where: { id }
        })

        if (!deleted) return ({ success: false, message: "Echec lors de la création du rappel de rendez-vous" })

        return ({ success: true, message: "Le rappel de rendez-vous à été créé avec succès." })

    } catch (err){
        console.error(`Echec lors de la suppression du rappel de rendez-vous, error : ${err}`);
        return{
            success:false,
            message : "Echec lors de la suppression du rappel de rendez-vous",
            error: err
        }
    }
}