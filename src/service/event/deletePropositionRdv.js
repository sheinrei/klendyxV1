import { klendyxPropositionRdvTable } from "../../models/klendyxPropositionRdvTable.js";


export async function deletePropositionRdv(db, userId, idEvent) {

    try {
        const Event = klendyxPropositionRdvTable(db);


        const deletedEvent = await Event.destroy({
            where: {
                userId: userId,
                id: idEvent
            }
        })

        if (deletedEvent) {
            return { success: true, message: "L'événement a été archivé avec succès." }
        } else {
            return {
                success: false,
                message: "Aucune proposition de rendez-vous n'a pu etre supprimée."
            }
        }
    } catch (err) {
        console.error(`Une erreur est survenue lors de la suppression d'une proposition de rendez-vous, error : ${err}`);
        return {
            success: false,
            message: "Une erreur est survenue lors de la suppression d'une proposition de rendez-vous",
            error: err
        }
    }

}