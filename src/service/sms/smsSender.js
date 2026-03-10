const latineChars = {
    // minuscules
    'à': 'a', 'â': 'a', 'ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'î': 'i', 'ï': 'i',
    'ô': 'o', 'ö': 'o',
    'ù': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c', 'œ': 'oe', 'æ': 'ae',
    // majuscules
    'À': 'A', 'Â': 'A', 'Ä': 'A',
    'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
    'Î': 'I', 'Ï': 'I',
    'Ô': 'O', 'Ö': 'O',
    'Ù': 'U', 'Û': 'U', 'Ü': 'U',
    'Ç': 'C', 'Œ': 'OE', 'Æ': 'AE',
}
const latineRegex = new RegExp(Object.keys(latineChars).join('|'), 'g')


export class SmsSender {
    /**
     * Constructor de la classe SmsSender - Service d'envoie de sms
     * @param {string} phone - Numéro de telephone mobile
     * @param {string} message - Content du sms
     */
    constructor(phone, message) {
        if (!message) {
            throw new Error("Message manquant pour l'envoi du SMS")
        }
        if (!phone) {
            throw new Error("Numéro de téléphone indisponible")
        }
        this.phone = phone
        this.message = this._normalizeCharToUtf(message)
        this.url = "https://api.brevo.com/v3/transactionalSMS/sms"
        this.headers = {
            "accept": "application/json",
            "api-key": process.env.BREVO_KEY,
            "content-type": "application/json"
        }
    }


    async _sendLowRemainingCredit() {
        const message = "Niveau de crédit sms faible! recharger https://app.brevo.com/billing/account/customize/message-credits"
        await fetch(this.url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                sender: "Klendyx",
                recipient: process.env.MY_PHONE,
                content: message,
                type: "transactional"
            })
        })

    };

    _formatNumeroPhone() {
        let result = this.phone.split(" ").join("");
        const size = result.length
        if ((result[0] !== "+" && size !== 10) || (result[0] === "+" && size !== 12)) {
            return { success: false, message: "Longueur du numero de tel incorrect", phone: result, size }
        }
        if (result[0] !== "+") {
            result = "+33" + result.slice(1)
        }
        return { success: true, phone: result }
    }


    _catchError(err) {
        console.warn(`Une erreur est survenue lors d'un envoie de sms, error : ${err}`)
        return {
            success: false,
            message: "Une erreur est survenue lors d'un envoie de sms",
            error: err
        }
    }

    _normalizeCharToUtf(str) {
        return str.replace(latineRegex, (char) => latineChars[char])
    }


    _controlOutput(data) {
        if (data.message == 'Invalid telephone number') {
            return {
                success: false,
                message: "Numéro de telephone invalide."
            }
        }
        if (!data.smsCount) {
            return {
                success: false,
                message: "Une erreur est survenue lors d'un envoie de sms."
            }
        }
        return {
            success: true,
            message: "Sms envoyé au destinataire avec succès."
        }
    }


    async sendSms() {
        try {
            const validPhone = this._formatNumeroPhone()
            if (!validPhone.success) {
                throw new Error(`Format du numéro de phone invalide, phone : ${validPhone.phone}`)
            }
            const sending = await fetch(this.url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    sender: "Klendyx",
                    recipient: validPhone.phone,
                    content: this.message,
                    type: "transactional"
                })
            })

            const data = await sending.json()
            console.log(data)
            if (data.remainingCredits < 70 && data.remainingCredits > 55) await this._sendLowRemainingCredit()

            const output = this._controlOutput(data)
            return {
                success: output.success,
                message: output.message
            }
        } catch (err) {
            return this._catchError(err)
        }
    }
}




