import { creditTable } from "../../models/creditTable.js";
import { Op } from "sequelize";

export async function getCredit(db, userId) {
    const Credit = creditTable(db);

    const data = await Credit.findOne({ where: { userId: userId } })

    return data
}


/**
 * Récupère tout les crédits avec condition sur refreshAt > now()
 * @param {*} db 
 * @returns {Promise<object>} - object key = success, message, data
 */
export async function getAllCredit(db) {

    try {
        const Credit = creditTable(db);
        const data = await Credit.findAll({
            where: {
                refreshAt: {
                    [Op.lt]: new Date()
                }
            }
        })

        if (!data) {
            throw new Error("Aucune data récupéré dans la table Credit")
        }

        return {
            success: true,
            message: "Tout les crédits ont été récupéré avec succès.",
            data
        }

    } catch (err) {
        console.warn(`Une erreur est survenue lors de la récupération de tout les crédits en base de donnée, error : ${err}`)
        return {
            success: false,
            message: 'Une erreur est survenue lors de la récupération de tout les crédits en base de donnée',
            error: err
        }
    }
}