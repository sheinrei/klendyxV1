import { contactFavTable } from "../../models/contactFavTable.js";

export async function deleteContactFav(db, req) {

    const Contact = contactFavTable(db);

    const deleted = await Contact.delete({
        where: { email: email }
    })

    if (deleted) {
        return { success: true, message: "Contact supprimer avec succes !" }
    }
}