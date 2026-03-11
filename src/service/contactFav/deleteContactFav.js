import { contactFavTable } from "../../models/contactFavTable.js";

export async function deleteContactFav(db, id) {
    try {
        const Contact = contactFavTable(db);

        const deleted = await Contact.destroy({
            where: { id }
        })

        if (!deleted) {
            return {
                success: false,
                message: "Erreur survenu nous n'avons pas pu supprimer ce contact."
            }
        }
        return {
            success: true,
            message: "Contact supprimer avec succès."
        }
    } catch (err) {
        console.warn(`Une erreur est survenue lors de la suppression d'un contact favori, error : ${err}`);
        return {
            success: false,
            message: "Une erreur est survenue lors de la suppression d'un contact favori.",
            error: err
        }
    }
}


