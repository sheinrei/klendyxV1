import { userPreferenceTable } from "../../models/userPreferenceTable.js";
import db from "./../../sequelize.js"


export class UserPreference {

    constructor(userId) {
        this.userId = userId;
        this.db = db
        this.TableUserPreference = userPreferenceTable(this.db);
    }

    #catchError(err, fn) {
        console.error(`[ UserPreference ] Erreur lors de l'execution de la fonction ${fn}, error : ${err}`)
        return {
            success: false,
            message: `Une erreur avec le serveur est survenue lors du traitement de vos préférences. Veuillez rééessayer plus tard.`,
        }
    }


    async createUserPreference() {
        try {
            const created = await this.TableUserPreference.create({
                userId: this.userId
            })
            return {
                success: created ? true : false,
                message: created
                    ? "Les préférences ont été créées avec succès."
                    : "Une erreur est survenue lors de la création des préférences utilisateur."
            }
        } catch (err) {
            return this.#catchError(err, "createUserPreference")
        }
    }



    async getUserPreference() {
        try {
            const get = await this.TableUserPreference.findOne({
                where: { userId: this.userId }
            })

            return {
                success: !!get,
                message: get
                    ? "Les préférences ont été récupérées avec succès."
                    : "Une erreur est survenue lors de la récupération des préférences utilisateur.",
                data : get
            }

        } catch (err) {
            return this.#catchError(err, "getUserPreference")
        }
    }

    /**
     * 
     * @param {object} dataDTO - object doit contenir {emailNotification,doubleAuth, openDyslexie}
     * @returns 
     */
    async updateUserPreference(dataDTO) {
        try {
            const [updated] = await Table.update(
                dataDTO,
                { where: { userId: this.userId } }
            )

            return {
                success: updated > 0,
                message: updated > 0
                    ? "Les préférences ont été mises à jour avec succès"
                    : "Une erreur est survenue lors de la mise à jour des préférences utilisateur."
            }
        } catch (err) {
            return this.#catchError(err, "updateUserPreference")
        }
    }

    async deleteUserPreference() {
        try {
            const deleted = await this.TableUserPreference.destroy({
                where: { userId: this.userId }
            })
            return {
                success: !!deleted,
                message: deleted
                    ? "Les préférences ont été supprimées avec succès"
                    : "Une erreur est survenue lors de la suppression des préférences utilisateur."
            }
        } catch (err) {
            return this.#catchError(err, "deleteUserPreference")
        }

    }

}