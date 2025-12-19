import { rappelRdvTable } from "../../models/rappelRdvTable.js";



export async function getRappelRdv(db, userId) {

    const Table = rappelRdvTable(db)

    const getAllRappel = await Table.findAll({
        where : { idUser : userId}
    })

    return{
        rappelRdv : getAllRappel
    }
}