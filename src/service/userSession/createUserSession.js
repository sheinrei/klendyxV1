import { userSessionTable } from "../../models/userSessionTable.js";

export async function createUserSession(db, userId) {

    const UserSession = userSessionTable(db);

    const created = await UserSession.create({
        userId: userId,
        isLogged: true,

    })

    return created
        ? { success: true, message: "Utilisateur connecté" }
        : { success: false, message: "Erreur serveur, impossible d'enregistrer la session utilisateur" }
}