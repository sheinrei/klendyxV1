
import { KlendyxMailer } from "./ClassMailer"
import db from "./../../sequelize.js"

export async function sendAllEmail() {
    try {
        const Mailer = new KlendyxMailer("l.beaute@laposte.net")
        await Mailer.sendDeleteAccount("url")
        await Mailer.send2FA("123456")
        await Mailer.sendForgotPassword("url")
        await Mailer.sendVerifyAccount("url")
        await Mailer.sendPasswordChanged(1, "url")
        await Mailer.sendConfirmationRdv("teste", "tete", "Laurent", "Votre garage", "12/03/26", "12/03/26", "12/03/26")
        await Mailer.sendPropositionRdv("url", "Beaute", "Laurent", "Votre garage", "teste", "teste", "12/03/26", "12/03/26", "12/03/26")
        await Mailer.sendResolvMatching("url")
        await Mailer.sendValidationMatching(1, "teste", "12/03/26", "12/03/26", "12/03/26", db)

        const requ = {
            body: {
                eventTitle: "teste",
                durationEvent: "1",
                contact: ["moi", "et moi"],
                responseUser: true,
                message: "Oui je valide"
            }
        }
        await Mailer.sendNewMatchingEvent(requ, 1, "url", db)
        await Mailer.sendResolvPropositionRdv(requ, "Votre garage", "Beaute Laurent")
    } catch (err) {
        console.error(`Une erreur est survenue lors de teste d'envoie de tes les emails, error : ${err}`)
    }
}