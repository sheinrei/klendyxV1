import { contactFavTable } from "../../models/contactFavTable.js";
import { Op } from "sequelize";
export async function getContactFav(db, req) {

    const Contact = contactFavTable(db);

    const idUser = req.userId

    const getContact = await Contact.findAll({
        where: { idUser: idUser }
    })


    if (getContact) {
        return { success: true, message: "Contact récupéré avec succes !", data : getContact }
    }

    return { sucess: false, message: "Problème survenu avec le serveur, impossible de récuperer les contacts" }
}

//recherche dynamique dans un champs input
export async function getDynamicContactFav(db, req) {
    const Contact = contactFavTable(db);

    const id = req.userId
    const inputSearch = req.body.searching

    const getContact = await Contact.findAll({
        where: {
            idUser: id,
            [Op.or]: [
                { nom: { [Op.like]: `%${inputSearch}%` } },
                { prenom: { [Op.like]: `%${inputSearch}%` } },
                { email: { [Op.like]: `%${inputSearch}%` } },
                { phone: { [Op.like]: `%${inputSearch}%` } }
            ]
        }
    })
    return {getContact}
}



