import { contactFavTable } from "../../models/contactFavTable.js";

export async function deleteContactFav(db, req) {

    const Contact = contactFavTable(db);

    const deleted = await Contact.destroy({
        where: { id: req.body.id }
    })

    if (deleted) {
        return { success: true, message: "Contact supprimer avec succès !" }
    }
    return {success: false, message : "Erreur survenu nous n'avons pas pu supprimer ce contact."}
}


