import { eventKlendyxTable } from "../../models/eventKlendyxTable.js";

export async function createEventKlendyx(db, req) {

    const Table = eventKlendyxTable(db);

    try {
        const create = await Table.create({
            userId: req.userId,
            summary: req.body.summary,
            describe: req.body.describe,
            image: req.body.image || null,
            hourStart: req.body.hourStart,
            hourEnd: req.body.hourEnd,
            allDay: req.body.allDay || false,
            
        })

        if (!create) {
            return { success: false, message: "Une erreur est survenu lors de la création du rendez-vous " }
        }
        
        return {success : true, message: "Le nouvel évènement a été ajouté dans votre agenda klendyx avec succès.", data : create}
    } catch (err){
        console.log(err)
        return({ success:false, messgae : "Une erreur est survenu lors de la création du rendez-vous ", error : err})
    }

}

