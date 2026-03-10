import { contactFavTable } from "../../models/contactFavTable.js";

export async function createContactFav(db, req) {

    const Contact = contactFavTable(db);

    const create = await Contact.create({
        idUser : req.userId,
        nom : req.body.nom,
        prenom : req.body.prenom,
        email : req.body.email,
        phone : req.body.phone ?? "non renseigné",
    })

    if (create){
        return {success:true, message : "Contact créé avec succes !", data: create}
    }
    return {success: false, message: "Echec lors de la création du nouveau contact"}
}

