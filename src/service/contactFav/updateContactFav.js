import { contactFavTable } from "../../models/contactFavTable.js";

export async function updateContactFav(db, req) {

    const Contact = contactFavTable(db);
    const update = await Contact.update({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        phone: req.body.phone,
    }, {
        where: {
            id: req.body.id
        }
    })

    if (update) {
        return { success: true, message: "Contact modifié avec succes." }
    }
    return{success:false, message : "Erreur lors de la modification, veuillez réessayer plus tard."}
}

