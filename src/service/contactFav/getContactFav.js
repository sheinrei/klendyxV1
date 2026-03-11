import { contactFavTable } from "../../models/contactFavTable.js"
import { Op } from "sequelize"

export async function getAllContactFav(db, userId) {
    try {
        const Contact = contactFavTable(db);
        const getContacts = await Contact.findAll({
            where: { userId } 
        });

        const success = getContacts.length > 0;

        return {
            success,
            message: success ? "Contacts récupérés avec succès." : "Aucun contact disponible.",
            data: getContacts
        };
    } catch (err) {
        console.warn(`Erreur lors de la récupération des contacts favoris, error : ${err}`);
        return {
            success: false,
            message: "Erreur lors de la récupération des contacts favoris.",
            error: err
        };
    }
}



//recherche dynamique 
export async function getDynamicContactFav(db, req) {
    const Contact = contactFavTable(db);

    const id = req.userId
    const inputSearch = req.body.searching

    const getContact = await Contact.findAll({
        where: {
            userId: id,
            [Op.or]: [
                { nom: { [Op.like]: `%${inputSearch}%` } },
                { prenom: { [Op.like]: `%${inputSearch}%` } },
                { email: { [Op.like]: `%${inputSearch}%` } },
                { phone: { [Op.like]: `%${inputSearch}%` } }
            ]
        }
    })
    return { getContact }
}



