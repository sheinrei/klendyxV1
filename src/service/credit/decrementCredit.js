import { creditTable } from "../../models/creditTable.js"


export const decrementCredit = async (db, req, plateform)=>{
    const userId = req.userId;
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