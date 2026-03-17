import { creditTable } from "../../models/creditTable.js"


export const decrementCredit = async (db, userId, plateform)=>{
    const Credit = creditTable(db);

    try{
        const decrement = await Credit.decrement(plateform , { by : 1, where : {userId : userId} })
        if (decrement){
            return {success:true, message:"Compte crédit mail decrementé"}
        }
    }catch(err){
        return {success: false, message:err}
    }

}

export const incrementCredit = async (db, userId, plateform)=>{
    try{
        const Credit = creditTable(db);
        const increment = await Credit.increment(plateform, { by : 1 , where : {userId}})
    }catch(err){
        console.error(err)
        return {
            success:false,
            message : "L'incrementation de credit a échoué",
            error: err
        }
    }
}