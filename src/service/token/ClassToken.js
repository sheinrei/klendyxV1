import tokenTable from "./../../models/tokenTable.js"
import db from "./../../sequelize.js"
import crypto from "crypto"



/**
 * @typedef {Object} TokenResult
 * @property {boolean} success - True si la création a réussi
 * @property {string} message - Message descriptif
 * @property {Object|null} data - La data du/des token(s)
 */



export class Token {

    constructor() {
        this.db = db;
        this.TableToken = tokenTable(this.db)
    }

    #catchError(err, fn) {
        console.error(`[ Token ] Erreur lors de l'execution de la fonction ${fn}, error : ${err}`)
        return {
            success: false,
            message: `Une erreur avec le serveur est survenue lors du traitement de token. Veuillez rééessayer plus tard.`,
        }
    }


    /* ================
        CREATION
    ================*/

    /**
     * Création d'un token
     * @param {number} userId 
     * @param {string} typeToken 
     * @param {string} token 
     * @returns {TokenResult}
     */
    async createToken(userId, typeToken, token) {
        console.log("Création d'un token en cours")
        try {
            const created = await this.TableToken.create({
                userId,
                type: typeToken,
                token: JSON.stringify(token)
            })
            return {
                success: !!created,
                message: created
                    ? "Le token a été créé avec succès."
                    : "Echec lors de la création du token.",
                data: created
            }
        } catch (err) {
            return this.#catchError(err, "createToken")
        }
    }



    /**
     * Génere un token via crypto et create d'un nouveau token.
     * @param {number} userId - L'id de l'utilisateur
     * @param {string} type - Le type de token ("2FA", "GoogleSync")
     * @returns {TokenResult}
     */
    async generateAndCreateToken(userId, type) {
        try {
            const token = crypto.randomBytes(32).toString("hex")
            const created = await instanceToken.create({
                userId,
                type: type,
                token,
            })
            return {
                success: !!created,
                message: created
                    ? "Le token a été créé avec succès."
                    : "Echec lors de la création du token.",
                data: created
            }
        } catch (err) {
            return this.#catchError(err, "generateAndCreateToken")
        }
    }



    /* ================
        UPDATE
    ================*/


    /**
     * Mise à jour d'un token.
     * @param {number} userId - id de l'utilisateur
     * @param {string} typeToken - Le type de token ("2FA", "GoogleSync")
     * @param {string} token - Le noueau token
     * @returns {TokenResult}
     */
    async updateToken(userId, typeToken, token) {
        console.log(`Update d'un token ${typeToken} en cours ...`)
        try {
            const [updated] = await this.TableToken().update({
                token: JSON.stringify(token)
            }, {
                where: {
                    userId,
                    type: typeToken
                }
            })
            return {
                success: updated > 0,
                message: updated > 0
                    ? `Le token ${typeToken} modifié avec succès.`
                    : `Aucun token ${typeToken} n'a été modifié.`,
                data: updated
            }
        } catch (err) {
            return this.#catchError(err, "updateToken")
        }
    }




    /* ================
        GET
    ================*/


    //Récupère la liste de tout les tokens.
    async getAllToken() {
        try {
            const tokens = await this.TableToken.findAll();

            return {
                success: !!tokens,
                message: tokens
                    ? "La liste de tout les tokens a été récupéré avec succès."
                    : "Aucun token n'a été récupéré.",
                data: tokens
            }
        } catch (err) {
            return this.#catchError(err, "getAllToken")
        }
    }


    /**
     * Récupère un token selon l'user et le type de token
     * @param {string} type - Le type de token ("2FA", "GoogleSync")
     * @param {number} userId - Id de l'utilisateur
     * @returns {TokenResult}
     */
    async getToken(type, userId) {
        try {
            const get = await this.TableToken.findOne({
                where: { userId: userId, type }
            });
            return {
                success: !!get,
                message: get
                    ? "Le token a été récupéré avec succès."
                    : "Aucun token n'a été récupéré.",
                data: get
            }
        } catch (err) {
            return this.#catchError(err, "getToken")
        }
    }


    /* ================
        DELETE
    ================*/

    /**
     * Supprime un token avec {where {token}}
     * @param {string} token - Le token qui est à supprimer 
     * @returns {TokenResult}
     */
    async deleteToken(token) {
        try {
            const deletedToken = await this.TableToken.destroy({
                where: { token }
            })
            return {
                success: !!deletedToken,
                message: deletedToken
                    ? `Le token a été supprimé avec succès.`
                    : "Echec lors de la suppression du token.",
                data: deletedToken
            }
        } catch (err) {
            return this.#catchError(err, "deleteToken")
        }
    }

    /**
     * Supprime un token d'authentification à un calendar provider
     * @param {number} userId - L'id de l'utilisateur qui doit supprimer le token
     * @param {string} provider - "google", "apple", "outlook" 
     * @returns {TokenResult}
     */
    async deleteTokenSyncCalendar(userId, provider) {
        try {
            const deletedToken = await this.TableToken.destroy({
                where: {
                    userId,
                    type: `${provider}Sync`
                }
            })
            return {
                success: !!deletedToken,
                message: deletedToken
                    ? `La synchronisation avec votre agenda ${provider} a été révoqué avec succès`
                    : `La suppression de synchronisation de votre agenda ${provider} a échoué, aucune synchronisation n'a été trouvée`,
                data: deletedToken
            }
        } catch (err) {
            return this.#catchError(err, "deleteTokenSyncCalendar")
        }
    }


    /**
     * Supprimer tout les tokens de type pour un utilisateur.
     * @param {number} userId - L'id de l'utilisateur. 
     * @param {string} type - Le type de token à supprimer ("2FA", etc..).
     * @returns {TokenResult}
     */
    async deleteAllUserTokenByType(userId, type) {
        try {
            const Token = tokenTable(db);
            const deletedToken = await Token.destroy({
                where: {
                    userId,
                    type
                },
            })
            return {
                success: !!deletedToken,
                message: deletedToken
                    ? "Le token a été supprimé avec succès."
                    : "Echec lors de la suppression de tokens",
                data : deletedToken
            }
        } catch (err) {
            return this.#catchError(err, "deleteAllUserTokenByType")
        }
    }

}

