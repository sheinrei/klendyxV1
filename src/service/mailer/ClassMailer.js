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
                message: `L'email de confirmation du rendez-vous a été envoyé au destinataire ${this.email} avec succès.`
            }

        } catch (err) {
            return this._errorCatching(err)
        }
    }


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
                message: sending.messageId ? `Email envoyé au destinataire ${this.email}` : `L'email n'a pas pu être envoyé au destinataire ${this.email}`
            }
        } catch (err) {
            return this._errorCatching(err)
        }
    }


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


    async sendValidationMatching(id, titleEvent, dateEvent, hoursStart, hoursEnd) {
        try {

            const dataInitialisateur = await getUserData(null, db, id)
            const initialisateur = dataInitialisateur.nom + " " + dataInitialisateur.prenom

            const html = this._createFullHtml(templateValidationMatching
                .replace(/{initialisateur}/, initialisateur)
                .replace(/{titleEvent}/, titleEvent)
                .replace(/{dateEvent}/, dateEvent)
                .replace(/{hoursStart}/, hoursStart)
                .replace(/{hoursEnd}/, hoursEnd)
            )
            const mailOptions = this._createOption(titleEvent, html)
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

    async sendResolvMatching(url) {
        try {

            const html = this._createFullHtml(templateResolvMatching.replace(/{url}/, url))
            const mailOptions = this._createOption("Votre demande de matching de rendez-vous Klendyx est resolue", html)
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
            return this._errorCatching(err)
        }
    }

    async sendPropositionRdv(url, prenom, nameInitialisateur, title, commentaire, dayStart, hourStart, hourEnd) {
        try {

            const day = new Date(dayStart.replace(":", "-"))
            day = day.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })

            const html = this._createFullHtml(
                templatePropositionRdv
                    .replace(/{prenom}/, prenom)
                    .replace(/{NAME_INITIALISATEUR}/, nameInitialisateur)
                    .replace(/{TITLE}/, title)
                    .replace(/{DAY}/, day)
                    .replace(/{HOUR_START}/, hourStart.replace(":", "h"))
                    .replace(/{HOUR_END}/, hourEnd.replace(":", "h"))
                    .replace(/{COMMENTAIRE}/, commentaire ? `<p style="margin-bottom:15px">Information complémentaire : ${commentaire} </p>` : "")
                    .replace(/{URL}/, url)
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
            return this._errorCatching(err)
        }



    }


    async sendNewMatchingEvent(req, url) {
        try {
            const dataInitialisateur = await getUserData(req, db)
            const initialisateur = dataInitialisateur.nom + " " + dataInitialisateur.prenom
            const html = this._createFullHtml(
                templateNewMatchingEvent
                    .replace(/{INITIALISATEUR}/, initialisateur)
                    .replace(/{URL}/, url)
                    .replace(/{EVENT_TITLE}/, req.body.eventTitle)
                    .replace(/{EVENT_ADRESS}/, req.body.eventAddress ?? "Non renseignée")
                    .replace(/{EVENT_DESCRIPTION}/, req.body.description ?? "Non renseignée")
                    .replace(/EVENT_DURATION/, req.body.durationEvent)
                    .replace(/NOMBRE_PARTICIPANT/, req.body.contact.length > 1 ? `-Nombre de participants : ${req.body.contact.length}` : "")
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
            return this._errorCatching(err)
        }
    }

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

    async sendForgotPassword(url) {
        try {

            const html = this._createFullHtml(templateForgotPassord.replace(/{URL}/, url))
            const mailOptions = this._createOption(`Modifié votre mot de passe Klendyx`, html)
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