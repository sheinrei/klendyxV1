import db from "./../../sequelize.js"
import { contactFavTable } from "../../models/contactFavTable.js";
import { Op } from "sequelize"


/**
 * @typedef {object} ContactFavoriResult
 * @property {boolean} success - Le resultat du traitement
 * @property {string} message - Message descriptif
 * @property {Object|null} data - Le(s) contact(s) favoris ou null
 */


/**
 * @typedef {object} dataDTO
 * @property {string} nom
 * @property {string} prenom
 * @property {string|null} email
 * @property {string|null} phone
 */



export class ContactFavoris {

    constructor(userId) {
        this.userId = userId;
        this.db = db
        this.TableContactFavoris = contactFavTable(this.db)
    }

    #catchError(err, fn) {
        console.error(`[ ContactFavoris ] Erreur lors de l'execution de la fonction ${fn}, error : ${err}`)
        return {
            success: false,
            message: `Une erreur avec le serveur est survenue lors du traitement d'un contact favoris.`,
        }
    }


    /**
     * Créer un nouveau contact favoris
     * @param {dataDTO} dataDTO - Les données necessaire pour la création
     * @returns {ContactFavoriResult}
     */
    async createContactFav(dataDTO) {
        try {
            const { nom, prenom, email, phone } = dataDTO
            const created = await this.TableContactFavoris.create({
                userId: this.userId,
                nom,
                prenom,
                email: email || "non renseigné",
                phone: phone || "non renseigné",
            })

            return {
                success: !!created,
                message: created
                    ? "Le contact favoris a été créé avec succès."
                    : "Echec lors de la création d'un contact favoris.",
                data: created
            }
        } catch (err) {
            return this.#catchError(err, "createContactFav")
        }
    }


    /**
     * Supprime un contact favoris
     * @param {number} id - L'id du contact favoris à supprimer 
     * @returns {ContactFavoriResult}
     */
    async deleteContactFav(id) {
        try {
            const deleted = await this.TableContactFavoris.destroy({
                where: { id, userId: this.userId }
            })
            return {
                success: !!deleted,
                message: deleted
                    ? "Le contact favoris a été supprimé avec succès."
                    : "Echec lors de la suppression du contact favoris.",
                data: deleted
            }
        } catch (err) {
            return this.#catchError(err, "deleteContactFav")
        }
    }



    /**
     * Met à jour un contact favoris
     * @param {dataDTO} dataDTO 
     * @returns {ContactFavoriResult}
     */
    async updateContactFav(dataDTO) {
        try {
            const { nom, prenom, email, phone, id } = dataDTO
            const Contact = contactFavTable(db);
            const [update] = await Contact.update({
                nom,
                prenom,
                email: email || "non renseigné",
                phone: phone || "non renseigné",
            }, {
                where: { id, userId: this.userId }
            })

            return {
                success: update > 0,
                message: update > 0
                    ? "Le contact favoris a été modifié avec succès."
                    : "Echec lors de la mise a jour du contact favoris"
            }
        } catch (err) {
            return this.#catchError(err, "updateContactFav")
        }
    }


    /**
     * Récupère tout les contacts favoris d'un utilisateur
     * @returns {ContactFavoriResult}
     */
    async getAllContactFav() {
        try {
            const [getContacts] = await this.TableContactFavoris.findAll({
                where: { userId }
            });
            return {
                success: getContacts > 0,
                message: getContacts > 0
                    ? "Contacts récupérés avec succès."
                    : "Aucun contact disponible.",
                data: getContacts
            };
        } catch (err) {
            return this.#catchError(err, "getAllContactFav")
        }
    }



    /**
     * Recherche dynamique d'un contact favoris selon un champ de recherche
     * @param {string} inputSearch - Le texte du champ de recherche 
     * @returns {ContactFavoriResult}
     */
    async getDynamicContactFav(inputSearch) {
        try {
            const [getContact] = await this.TableContactFavoris.findAll({
                where: {
                    userId: this.userId,
                    [Op.or]: [
                        { nom: { [Op.like]: `%${inputSearch}%` } },
                        { prenom: { [Op.like]: `%${inputSearch}%` } },
                        { email: { [Op.like]: `%${inputSearch}%` } },
                        { phone: { [Op.like]: `%${inputSearch}%` } }
                    ]
                }
            })
            return {
                success: getContact > 0,
                message : getContact > 0
                    ? "La liste des contacts favoris a été récupéré avec succès."
                    : "Aucun contact favoris n'a été trouvé.",
                data : getContact
            }
        } catch (err) {
            return this.#catchError(err, "getDynamicContactFav")
        }
    }
}