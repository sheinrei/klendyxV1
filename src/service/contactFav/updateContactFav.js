import { contactFavTable } from "../../models/contactFavTable.js";

export async function updateContactFav(db, req) {

    const Contact = contactFavTable(db);

    const update = await Contact.update({

        idUser,
        nom,
        prenom,
        email,
        phone,
    })

    if (update) {
        return { success: true, message: "Contact modifié avec succes!" }
    }
}