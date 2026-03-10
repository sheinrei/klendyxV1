import { creditTable } from "../../models/creditTable.js"



export async function updateUserCredit(userId, db, data){
    try{

        const Table = creditTable(db);
        const [updateCredits]= await Table.update(data, {
            where : { userId }
        })
    
        return {
            success : updateCredits > 0,
        }

    }catch(err){
        console.warn(`Une erreur est survenue lors de la mise a jour du crédit id : ${id}, error : ${err}`)
        return {
            success:false,
            message : "Une erreur est survenue lors de la mise a jour d'un crédit",
            error : err?.message || err
        }
    }
}