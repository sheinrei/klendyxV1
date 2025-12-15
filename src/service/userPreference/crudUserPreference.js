import { userPreferenceTable } from "../../models/userPreferenceTable.js";


export async function createUserPreference(db, idUser) {
    try {
        const Table = userPreferenceTable(db);
        const created = Table.create({
            userId: idUser
        })
        if (created)
            return { success: true, message: "Les préférence de l'utilisateur ont été créer avec succès" }
        if (!created) return ({ success: false, message: "Une erreur est survenue lors de la création des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err)
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }
}

export async function getUserPreference(db, idUser) {
    try {
        const Table = userPreferenceTable(db);
        const get = await Table.findOne({
            where: { userId: idUser }
        })

        if (get)
            return { success: true, message: "Les préférence de l'utilisateur ont été récupérées avec succès", data: get }
        if (!get) return ({ success: false, message: "Une erreur est survenue lors de la récupération des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err)
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }
}

export async function updateUserPreference(db, idUser, data) {
    try {
        const Table = userPreferenceTable(db);
        console.log(data)
        const updated = await Table.update(
            data,
            { where: { id: idUser } }
        )
        if (updated)
            return { success: true, message: "Les préférences ont été mises à jour avec succès" }
        if (!updated) return ({ success: false, message: "Une erreur est survenue lors de la mise à jour des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err);
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }

}

export async function deleteUserPreference(db, idUser) {
    try {
        const Table = userPreferenceTable(db);
        const deleted = await Table.destroy({
            where: { id: idUser }
        })
        if (deleted)
            return { success: true, message: "Toute les préférences ont bien été supprimées" }
        if (!deleted) return ({ success: false, message: "Une erreur est survenue lors de la suppression des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err);
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }

}