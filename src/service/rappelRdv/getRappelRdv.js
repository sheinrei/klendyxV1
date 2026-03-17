import { rappelRdvTable } from "../../models/rappelRdvTable.js";



export async function getUserRappelRdv(db, userId) {

    try {
        const Table = rappelRdvTable(db)
        const getAllRappel = await Table.findAll({
            where: { userId: userId }
        })
        return {
            success: true,
            message: "Liste des rappels de rendez-vous récupéré avec succès.",
            data: getAllRappel
        }
    } catch (err) {
        console.warn(`Echec lors de la récupération de tout les rappels de rendez-vous dans la base de donnée, error: ${err}`);
        return {
            success: false,
            message: "Echec lors de la récupération des rappels de rendez-vous de l'utilisateur.",
            error: err
        }
    }
}

export async function getRappelRdvById(db, id){
    try{
        const Table = rappelRdvTable(db)
        const get = await Table.findByPk(id)
        return {
            success: get ? true : false,
            data: get
        }
    }catch(err){
        console.error(err)
        return {
            success:false
        }
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