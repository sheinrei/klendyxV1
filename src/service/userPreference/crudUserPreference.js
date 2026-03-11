import { userPreferenceTable } from "../../models/userPreferenceTable.js";


export async function createUserPreference(db, userId) {
    try {
        const Table = userPreferenceTable(db);
        const created = Table.create({
            userId: userId
        })
        if (created)
            return { success: true, message: "Les préférence de l'utilisateur ont été créer avec succès" }
        if (!created) return ({ success: false, message: "Une erreur est survenue lors de la création des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err)
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }
}

export async function getUserPreference(db, userId) {
    try {
        const Table = userPreferenceTable(db);
        const get = await Table.findOne({
            where: { userId: userId }
        })

        if (get)
            return { success: true, message: "Les préférence de l'utilisateur ont été récupérées avec succès", data: get }
        if (!get) return ({ success: false, message: "Une erreur est survenue lors de la récupération des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err)
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }
}

export async function updateUserPreference(db, userId, data) {
    try {
        const Table = userPreferenceTable(db);
        console.log(data)
        const updated = await Table.update(
            data,
            { where: { id: userId } }
        )
        if (updated)
            return { success: true, message: "Les préférences ont été mises à jour avec succès" }
        if (!updated) return ({ success: false, message: "Une erreur est survenue lors de la mise à jour des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err);
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }

}

export async function deleteUserPreference(db, userId) {
    try {
        const Table = userPreferenceTable(db);
        const deleted = await Table.destroy({
            where: { id: userId }
        })
        if (deleted)
            return { success: true, message: "Toute les préférences ont bien été supprimées" }
        if (!deleted) return ({ success: false, message: "Une erreur est survenue lors de la suppression des préférences utilisateur, rééssayer plus tard si le problème persiste veuillez contacter notre support" })

    } catch (err) {
        console.log(err);
        return { success: false, message: "Une erreur est survenue, rééssayer plus tard si le problème persiste veuillez contacter notre support", err }
    }

}