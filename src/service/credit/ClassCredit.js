import db from "./../../sequelize.js"
import { creditTable } from "../../models/creditTable.js"
import { Op } from "sequelize";




export class Credit {

    constructor(userId) {
        this.userId = userId;
        this.db = db;
        this.TableCredit = creditTable(this.db)
    }


    #catchError(err, fn) {
        console.error(`[ Crédit ] Erreur lors de l'execution de la fonction ${fn}, error : ${err}`)
        return {
            success: false,
            message: `Une erreur avec le serveur est survenue lors du traitement de crédit.`,
        }
    }



    async createCreditUser() {
        try {
            const created = await this.TableCredit.create({
                userId: this.userId
            })
            return {
                success: !!created,
                message: created
                    ? "Les crédits de l'utilisateur ont été créés avec succès."
                    : "Echec survenue lors de la création de crédit d'un utilisateur",
                data: created
            }
        } catch (err) {
            return this.#catchError(err, "createCreditUser")
        }
    }



    async updateUserCredit(data) {
        try {
            const [updateCredits] = await this.TableCredit.update(data, {
                where: { userId: this.userId }
            })

            return {
                success: updateCredits > 0,
                message: updateCredits > 0
                    ? "Les crédits ont été mis à jour avec succès."
                    : "Echec survenue lors de la mise à jour des crédits.",
                data: updateCredits
            }

        } catch (err) {
            return this.#catchError(err, "updateUserCredit")
        }
    }


    async getAllCredit() {
        try {
            const data = await this.TableCredit.findAll({
                where: {
                    refreshAt: {
                        [Op.lt]: new Date()
                    }
                }
            })
            return {
                success: !!data,
                message: data
                    ? "Tout les crédits ont été récupéré avec succès."
                    : "Aucun crédit n'a été trouvé.",
                data
            }
        } catch (err) {
            return this.#catchError(err, "getAllCredit")
        }
    }


    async getCredit() {
        try {
            const data = await this.TableCredit.findOne({
                where: {
                    userId: this.userId
                }
            })

            return {
                success: !!data,
                message: data
                    ? "Les crédits ont été récupéré avec succès."
                    : "Aucun crédit n'a été retrouvé?",
                data
            }
        } catch (err) {
            return this.#catchError(err, "getCredit")
        }
    }


    async decrementCredit(plateform) {
        try {
            const decrement = await this.TableCredit.decrement(plateform, { by: 1, where: { userId: this.userId } })
            return {
                success: !!decrement,
                message: decrement
                    ? `Le crédit ${plateform} a été décrémenté avec succès.`
                    : `Echec lors de la décrémentation du crédit ${plateform}.`,
                data: decrement,
            }
        } catch (err) {
            return this.#catchError(err, "incrementCredit")
        }
    }

    async incrementCredit(plateform) {
        try {
            const increment = await this.TableCredit.increment(plateform, { by: 1, where: { userId: this.userId } })
            return {
                success: !!increment,
                message: increment
                    ? `Le crédit ${plateform} a été restauré avec succès.`
                    : `Echec lors de la restauration du crédit ${plateform}.`,
                data: increment,
            }
        } catch (err) {
            return this.#catchError(err, "incrementCredit")
        }
    }
}