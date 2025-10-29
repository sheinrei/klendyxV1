import { contactFavTable } from "../../models/contactFavTable.js";

export async function getContactFav(db, req) {

    const Contact = contactFavTable(db);

    const idUser = req.userId

    const getContact = await Contact.find({
        where: { idUser: idUser }
    })

    if (get) {
        return { success: true, message: "Contact récupéré avec succes !", getContact }

    }
}