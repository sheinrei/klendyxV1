


import { contactFavTable } from "../../models/contactFavTable.js";
import { creditTable } from "../../models/creditTable.js";
import { eventKlendyxTable } from "../../models/eventKlendyxTable.js";
import { klendyxPropositionRdvTable } from "../../models/klendyxPropositionRdvTable.js";
import { matchingEventTable } from "../../models/matchingEventTable.js";
import { rappelRdvTable } from "../../models/rappelRdvTable.js";
import tokenTable from "../../models/tokenTable.js";
import { userPreferenceTable } from "../../models/userPreferenceTable.js";
import { userSessionTable } from "../../models/userSessionTable.js";
import utilisateurTable from "../../models/utilisateurTable.js";



async function deleteAllTable(id, db) {

    try {
        await Promise.all([
            contactFavTable(db).destroy({ where: { idUser: id } }),
            creditTable(db).destroy({ where: { userId: id } }),
            eventKlendyxTable(db).destroy({ where: { userId: id } }),
            klendyxPropositionRdvTable(db).destroy({ where: { userId: id } }),
            matchingEventTable(db).destroy({ where: { idUser: id } }),
            rappelRdvTable(db).destroy({ where: { idUser: id } }),
            tokenTable(db).destroy({ where: { idUser: id } }),
            userPreferenceTable(db).destroy({ where: { userId: id } }),
            userSessionTable(db).destroy({ where: { userId: id } }),
            utilisateurTable(db).destroy({ where: { id } }),
        ]);
        return { success: true };

    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return {
            success: false,
            message: "Une erreur est survenue avec le serveur pendant la suppression du count, l'état d'origine a été remis. Veuillez réessayer plus tard, si le problème persiste merci de contacter le support Klendyx"
        };
    }
}




export async function deleteAccount(token, db) {

    const TableToken = tokenTable(db);
    const deletedToken = await TableToken.findOne({ where: { token: token } });
    const idUser = deletedToken.idUser;

    const deleted = await deleteAllTable(idUser, db)
    return {
        success: deleted.success,
        message: deleted.success
            ? "Votre compte a été supprimé avec succès"
            : "Votre compte n'a pas pu être supprimé avec succès"
    }
}