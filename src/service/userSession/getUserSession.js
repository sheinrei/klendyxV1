import { userSessionTable } from "../../models/userSessionTable.js";


export async function getUserSession(db, req) {

    const UserSession = userSessionTable(db);

    const get = await UserSession.findOne({
        where: { userId: req.userId }
    })

    return { logged: get.isLogged }

}