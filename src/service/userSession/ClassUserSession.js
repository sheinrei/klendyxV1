import db from "./../../sequelize.js"
import { userSessionTable } from "../../models/userSessionTable.js";


export class UserSession {

    constructor(userId) {
        this.db = db;
        this.TableUserSession = userSessionTable(this.db);
        this.userId = userId
    }


    #catchError(err, fn) {
        console.error(`[ USER SESSION ] Erreur lors de l'execution de la fonction ${fn}, error : ${err}`)
        return {
            success: false,
            message: `Une erreur avec le serveur est survenue lors du traitement de la session. Veuillez rééessayer plus tard.`,
        }
    }

    async createUserSession() {
        try {
            const created = await this.TableUserSession.create({
                userId: this.userId,
                isLogged: true,
            })
            return {
                success: !!created,
                message: created
                    ? "Utilisateur connecté"
                    : "Une erreur est survenue, impossible de créer la session utilisateur"
            }
        } catch (err) {
            return this.#catchError(err, "CreateUserSession")
        }
    }

    async deleteUserSession() {
        try {
            const deleted = await this.TableUserSession.destroy({
                where: { userId: this.userId }
            })

            return {
                success : !! deleted,
                message : deleted 
                ?"Utilisateur deconnecté"
                :  "Erreur serveur, impossible de supprimer la session utilisateur" 
            }
        } catch (err) {
            return this.#catchError(err, "deleteUsrSession")
        }
    }

    async getUserSession() {
        try {
            const get = await this.TableUserSession.findOne({ where: { userId: this.userId } })
            return { logged: get.isLogged }
        } catch (err) {
            return this.#catchError(err, "getUserSession")
        }
    }
}