import { contactFavTable } from "../../models/contactFavTable.js";

export async function createContactFav(db, dataDTO) {

    const { userId, nom, prenom, email, phone } = dataDTO
    const Contact = contactFavTable(db);

    const create = await Contact.create({
        userId,
        nom,
        prenom,
        email,
        phone: phone || "non renseigné",
    })

    if (create) {
        return { success: true, message: "Contact créé avec succes !", data: create }
    }
    return { success: false, message: "Echec lors de la création du nouveau contact" }
}

