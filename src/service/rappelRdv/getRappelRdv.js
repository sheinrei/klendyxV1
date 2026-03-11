import { rappelRdvTable } from "../../models/rappelRdvTable.js";



export async function getUserRappelRdv(db, userId) {

    const Table = rappelRdvTable(db)

    const getAllRappel = await Table.findAll({
        where: { userId: userId }
    })

    return {
        rappelRdv: getAllRappel
    }
}



export async function getAllRappelRdv(db) {

    try {
        const Table = rappelRdvTable(db)
        const getAllRappelRdv = await Table.findAll()

        return {
            success: true,
            data: getAllRappelRdv
        }

    } catch (err) {
        console.warn(`Echec lors de la récupération de tout les rappels de rendez-vous dans la base de donnée, error: ${err}`);
        return {
            success: false,
            message: "Echec lors de la récupération de tout les rappels de rendez-vous dans la base de donnée",
            error: err
        }
    }

}