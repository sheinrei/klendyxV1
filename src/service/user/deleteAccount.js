


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
            contactFavTable(db).destroy({ where: { idUser: id }, transaction }),
            creditTable(db).destroy({ where: { userId: id }, transaction }),
            eventKlendyxTable(db).destroy({ where: { userId: id }, transaction }),
            klendyxPropositionRdvTable(db).destroy({ where: { userId: id }, transaction }),
            matchingEventTable(db).destroy({ where: { idUser: id }, transaction }),
            rappelRdvTable(db).destroy({ where: { idUser: id }, transaction }),
            tokenTable(db).destroy({ where: { idUser: id }, transaction }),
            userPreferenceTable(db).destroy({ where: { userId: id }, transaction }),
            userSessionTable(db).destroy({ where: { userId: id }, transaction }),
            utilisateurTable(db).destroy({ where: { id }, transaction }),
        ]);
        return { success: true };

    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return { success: false };
    }
}




export async function deleteAccount(token, db) {

    const TableToken = tokenTable(db);
    const deletedToken = await TableToken.findOne({ where: { token: token } });

    const idUser = deletedToken.idUser;

    deleteAllTable(idUser, db)



}