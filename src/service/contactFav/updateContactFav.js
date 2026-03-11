import { contactFavTable } from "../../models/contactFavTable.js";

export async function updateContactFav(db, dataDTO) {
    try {
        const { nom, prenom, email, phone, id } = dataDTO
        const Contact = contactFavTable(db);
        const update = await Contact.update({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            phone: req.body.phone || "non renseigné",
        }, {
            where: { id }
        })

        if (!update) {
            return {
                success: false,
                message: "Erreur lors de la modification, veuillez réessayer plus tard."
            }
        }
        return {
            success: true,
            message: "Contact modifié avec succès."
        }
    } catch (err) {
        console.warn(`Echec lors de la mise à jour d'un contact favori, error : ${err}`)
        return {
            success: false,
            message: "Echec lors de la mise à jour d'un contact favori",
            error: err
        }
    }
}



