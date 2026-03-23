import nodemailer from "nodemailer"
import { getUserData } from "../user/getUserData.js";
import { template2FA } from "./template/template2FA.js"
import { templateConfirmationRdv } from "./template/templateConfirmationRdv.js"
import { templateDeleteAccount } from "./template/templateDeleteAccount.js"
import { templateForgotPassord } from "./template/templateForgotPassword.js"
import { templateNewMatchingEvent } from "./template/templateNewMatchingEvent.js"
import { templatePasswordChanged } from "./template/templatePasswordChanged.js"
import { templatePropositionRdv } from "./template/templatePropositionRdv.js"
import { templateResolvMatching } from "./template/templateResolvMatching.js"
import { templateResolvPropositionRdv } from "./template/templateResolvPropositionRdv.js"
import { templateValidationMatching } from "./template/templateValidationMatching.js"
import { templateVerifyAccount } from "./template/templateVerifyAccount.js"



export class KlendyxMailer {
    /**
     * Service d'envoie d'Email via smtp. 
     * @param {string} email - L'adresse email du destinataire
     */
    constructor(email) {
        if (!process.env.MAILER_USER || !process.env.MAILER_PASS) {
            throw new Error("Configuration SMTP manquante");
        }

        this.email = email;
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        });
    }

    /**
     * Créé les options pour envoyer l'email
     * @param {string} subject - Le titre qui sera affiché avant l'ouverture de l'email 
     * @param {string} html - Le content de l'email en format html
     * @returns 
     */
    _createOption(subject, html) {
        const textBrutFallback = html.replace(/<[^>]*>/g, "")
        const mailOptions = {
            from: '"Klendyx" <no-reply@klendyx.com>',
            to: this.email,
            subject, //Le titre qui sera affiché avant 'ouverture de l'email
            text: textBrutFallback, // fallback en cas de non gestion du texte html
            html,
        };
        return mailOptions
    }


    _createHtmlHeader() {
        return `
            <tr>
                <td style="background-color:#716af9; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
                    Klendyx
                </td>
            </tr>
    `
    }

    _createHtmlFooter() {
        const date = new Date()
        const year = date.getFullYear()
        return `
            <tr>
            <td style="background-color:#f4f4f4; padding:20px; text-align:center; font-size:12px; color:#777777;">
                &copy; ${year} Klendyx. Tous droits réservés.
            </td>
            </tr>
    `
    }

    //Assemble tout les élément pour former le corp complet de l'email
    _createFullHtml(htmlContent) {
        return `<body style="margin:0;padding:0; overflow:hidden;">
        <table width="50%" cellpadding="0" cellspacing="0" style="border:1px solid #b3b7be;border-radius:8px; overflow:hidden;">
        ${this._createHtmlHeader()}
        ${htmlContent}
        ${this._createHtmlFooter()}
        </table>
        </body>`
    }

    _errorCatching(err) {
        console.warn(`Une erreur est survenu lors d'un envoie d'un email' error : ${err}`)
        return {
            success: false,
            message: "Erreur avec le serveur est survenue lors de l'envoie d'un email.",
            error: err
        }
    }


    /**
     * Envoie un email de rappel de rendez-vous
     * @param {string} emailTitle 
     * @param {string} htmlContent 
     * @returns 
     */
    async sendRappelRdv(emailTitle, htmlContent) {
        try {
            const html = this._createFullHtml(htmlContent)
            const mailOptions = this._createOption(emailTitle, html)

            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }
            return {
                success: true,
                message: `L'email de rappel de rendez-vous a été envoyé au destinataire ${this.email} avec succès.`
            }

        } catch (err) {
            return this._errorCatching(err)
        }
    }


    /**
     * Envoie un email avce code pour double auth
     * @param {string} code 
     * @returns 
     */
    async send2FA(code) {
        try {
            const html = this._createFullHtml(template2FA.replace(/{code}/, code))
            const mailOptions = this._createOption("Votre code de double authentification", html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `L'email de double authentification a envoyé au destinataire ${this.email}` : `L'email n'a pas pu être envoyé au destinataire ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }


    /**
     * Envoie un email avec url pour confirmer suppression d'un compte
     * @param {string} url 
     * @returns 
     */
    async sendDeleteAccount(url) {
        try {
            const html = this._createFullHtml(templateDeleteAccount.replace(/{url}/, url))
            const mailOptions = this._createOption("Confirmer la suppression de votre compte Klendyx", html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }


    /**
     * Envoie un email pour notifier la résolution d'un matching de rendez-vous
     * @param {number} id - userId de l'initialisateur
     * @param {string} titleEvent - Le titre de l'événement du matching
     * @param {string} dateEvent - La date de l'événement
     * @param {string} hoursStart - Heure de détbut
     * @param {string} hoursEnd - Heure de fin 
     * @returns 
     */
    async sendValidationMatching(id, titleEvent, dateEvent, hoursStart, hoursEnd, db) {
        try {

            const dataInitialisateur = await getUserData(db, id)
            const initialisateur = dataInitialisateur.nom + " " + dataInitialisateur.prenom

            const html = this._createFullHtml(templateValidationMatching
                .replace(/{initialisateur}/, initialisateur)
                .replace(/{titleEvent}/, titleEvent)
                .replace(/{dateEvent}/, dateEvent)
                .replace(/{hoursStart}/, hoursStart)
                .replace(/{hoursEnd}/, hoursEnd)
            )
            const mailOptions = this._createOption(`Confirmation du rendez-vous "${titleEvent}" avec ${initialisateur}`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de la resolution de matching de rendez-vous a été envoyé à l'initialisateur.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }

    /**
     * Envoie un email de confirmation de la resolution de matching à l'initialisateur.
     * Redirige vers url pour voir le resultat et valider la date de matching
     * @param {string} url - url de redirection vers la page de resolution matching et confirmation de propositions
     * @returns 
     */
    async sendResolvMatching(url) {
        try {

            const html = this._createFullHtml(templateResolvMatching.replace(/{url}/, url))
            const mailOptions = this._createOption("Votre demande matching de rendez-vous Klendyx est resolue", html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }



    /**
     * Envoie un email de confirmation d'un rendez-vous
     * Param data pour le template de l'email
     * @param {*} title 
     * @param {*} commentaire 
     * @param {*} prenom 
     * @param {*} nameInitialisateur 
     * @param {*} dayStart 
     * @param {*} hourStart 
     * @param {*} hourEnd 
     * @returns 
     */
    async sendConfirmationRdv(title, commentaire, prenom, nameInitialisateur, dayStart, hourStart, hourEnd) {
        try {

            let day = new Date(dayStart.replace(":", "-"))
            day = day.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })

            const html = this._createFullHtml(
                templateConfirmationRdv
                    .replace(/{prenom}/, prenom)
                    .replace(/{title}/, title)
                    .replace(/{nameInitialisateur}/, nameInitialisateur)
                    .replace(/{DAY}/, day)
                    .replace(/{HOUR_START}/, hourStart.replace(":", "h"))
                    .replace(/{HOUR_END}/, hourEnd.replace(":", "h"))
                    .replace(/{COMMENTAIRE}/,
                        commentaire ? `<p style="margin-bottom:15px">Information complémentaire : ${commentaire} </p>` : ""
                    )
            )
            const mailOptions = this._createOption(`Confirmation de rendez-vous avec ${nameInitialisateur}`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `L'email de confirmation du rendez-vous a été envoyé avec succès.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }

    /**
     * Envoie un email à l'initialisateur d'une proposition de rendez-vous pour notifier que cette propostion a été répondu.
     * @param {*} req 
     * @param {*} nameInitialisateur 
     * @param {*} recipientFullName 
     * @returns 
     */
    async sendResolvPropositionRdv(req, nameInitialisateur, recipientFullName) {
        try {
            const responsProposition = req.body.responseUser == true ? "validé" : "refusé";
            const commentaire = req.body.message || "Pas de commentaire ajouté"
            const html = this._createFullHtml(
                templateResolvPropositionRdv
                    .replace(/{NAME_INITIALISATEUR}/, nameInitialisateur)
                    .replace(/{RECIPIENT_FULL_NAME}/, recipientFullName)
                    .replace(/{RESPONSE_PROPOSITION}/, responsProposition)
                    .replace(/{COMMENTAIRE}/, commentaire)

            )

            const mailOptions = this._createOption(`Votre proposition de rendez-vous avec ${recipientFullName} a été répondu`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            console.log(err)
            return this._errorCatching(err)
        }
    }


    async sendPropositionRdv(url,nom, prenom, nameInitialisateur, title, commentaire, dayStart, hourStart, hourEnd) {
        try {

            let day = new Date(dayStart.replace(":", "-"))
            day = day.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })

            const recipientFullName = `${prenom} ${nom}`

            const html = this._createFullHtml(
                templatePropositionRdv
                    .replace(/{PRENOM}/, prenom)
                    .replace(/{NAME_INITIALISATEUR}/, nameInitialisateur)
                    .replace(/{TITLE}/, title)
                    .replace(/{DAY}/, day)
                    .replace(/{HOUR_START}/, hourStart.replace(":", "h"))
                    .replace(/{HOUR_END}/, hourEnd.replace(":", "h"))
                    .replace(/{COMMENTAIRE}/, commentaire ? `<p style="margin-bottom:15px">Information complémentaire : ${commentaire} </p>` : "")
                    .replace(/{URL}/, url)
            )

            const mailOptions = this._createOption(`Votre proposition de rendez-vous avec ${recipientFullName}`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de proposition de rendez-vous a été envoyé avec succès.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }



    }



    /**
     * Envoie de l'email de création de matching de rdv au destinataire du matching de rdv avec l'url
     * avec lequel se diriger pour répondre au matching
     * @param {*} req - la req de l'api, par le futur changer ça et extraire uniquement les data necessaires
     * @param {number} userId - l'id de l'utilisateur
     * @param {string} url - L'url pour que le destinataire puisse répondre au matching
     * @param {object} db - La connexion vers la bdd
     * @returns 
     */
    async sendNewMatchingEvent(req, userId, url, db) {
        try {
            const dataInitialisateur = await getUserData(db, userId)
            const initialisateur = dataInitialisateur.nom + " " + dataInitialisateur.prenom
            const html = this._createFullHtml(
                templateNewMatchingEvent
                    .replace(/{INITIALISATEUR}/, initialisateur)
                    .replace(/{URL}/, url)
                    .replace(/{EVENT_TITLE}/, req.body.eventTitle)
                    .replace(/{EVENT_ADRESS}/, req.body.eventAddress ?? "Non renseignée")
                    .replace(/{EVENT_DESCRIPTION}/, req.body.description ?? "Non renseignée")
                    .replace(/{EVENT_DURATION}/, req.body.durationEvent)
                    .replace(/{NOMBRE_PARTICIPANT}/, req.body.contact.length > 1 ? `-Nombre de participants : ${req.body.contact.length}` : "")
            )

            const mailOptions = this._createOption(`Votre proposition de rendez-vous avec ${initialisateur}`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }


    /**
     * Email envoyé lors de l'inscription pour valider un nouveau compte Klendyx
     * @param {string} url - url vers la page qui va automatiquement confirmer le nouveau compte
     * @returns 
     */
    async sendVerifyAccount(url) {
        try {
            const html = this._createFullHtml(templateVerifyAccount.replace(/{URL}/, url))
            const mailOptions = this._createOption(`Confirmation création de votre compte Klendyx`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }

    /**
     * Envoie un email avec un url pour modifier son mot de passe perdu
     * @param {string} url - url de redirection vers la page de changement de mot de passe
     * @returns 
     */
    async sendForgotPassword(url) {
        try {

            const html = this._createFullHtml(templateForgotPassord.replace(/{URL}/, url))
            const mailOptions = this._createOption(`Modifiez votre mot de passe Klendyx`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }

    
    /**
     * Envoie un email pour notifier à l'utilisateur que son mot de passe Klendyx a été modifié
     * @param {*} User 
     * @param {*} url 
     * @returns 
     */
    async sendPasswordChanged(User, url) {
        try {
            const prenom = User.prenom
            const html = this._createFullHtml(
                templatePasswordChanged
                    .replace(/{URL}/, url)
                    .replace(/{PRENOM}/, prenom)
            )
            const mailOptions = this._createOption(`Votre mot de passe Klendyx a été modifié`, html)
            const sending = await this.transporter.sendMail(mailOptions);

            if (!sending.messageId) {
                throw new Error(`Echec lors de l'envoie d'un email, id indisponible de retour indisponible.\n ${sending}`)
            }

            return {
                success: sending.messageId ? true : false,
                message: sending.messageId ? `Un email de confirmation de suppression de votre compte vous a été envoyé par email.` : `L'email n'a pas pu être envoyé à l'adresse : ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }



}