import { userSessionTable } from "../../models/userSessionTable.js";


export async function deleteUserSession(db,req){

    const UserSession = userSessionTable(db);

    const deleted = await UserSession.destroy({
        where : { userId : req.userId}
    })

    return deleted 
    ? {success: true, message:"Utilisateur deconnecté"} 
    : {success:false, message:"Erreur serveur, impossible de supprimer la session utilisateur"}
}