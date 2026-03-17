import { deleteToken } from "../token/deleteToken.js"
import { getAllToken } from "../token/getToken.js"
import db from "./../../sequelize.js"


const TOKEN_RESSOURCE = [
    { type: "validationEventEmail", duration: 1000 * 60 * 60 * 24 * 2 }, // 2 jours
    { type: "2FA", duration: 1000 * 60 * 5 }, //5 minutes
    { type: "deleteAccount", duration: 1000 * 60 * 60 * 12 }, //12 heures
    { type : "forgotPassword", duration : 1000 * 60 * 10 } //10 minutes
]


export async function managementTokenValidite() {

    console.log("Declanchement de la fonction de management de token")
    const now = Date.now()
    const resultProcess = {
        successCount: 0,
        failed: []
    }

    try {
        const allTokens = await getAllToken(db)
        if (!allTokens.success) {
            return {
                success: false,
                message: "Impossible de récupérer les tokens",
                error: allTokens?.error
            }
        }
        const tokensData = allTokens.data

        for (const tokenRow of tokensData) {

            const { createdAt, type, token } = tokenRow
            const tokenConfig = TOKEN_RESSOURCE.find(t => t.type === type)

            if (!tokenConfig) {
                continue
            }

            const timeExpire = new Date(createdAt).getTime() + tokenConfig.duration

            if (now > timeExpire) {
                const deleted = await deleteToken(token, db)
                if (deleted.success) {
                    resultProcess.successCount++
                } else {
                    resultProcess.failed.push(deleted)
                }

            }
        }

        return resultProcess
    } catch (err) {
        console.log(`Erreur survenue lors de la suppression de token pendant une tâche cron, error : ${err}`)
        return {
            success: false,
            error: err
        }
    }
}