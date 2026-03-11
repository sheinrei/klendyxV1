import cron from "node-cron"
import { declencherNotificationsRdv } from "./cronRappelRdv.js"
import { managementTokenValidite } from "./tokenValiditeManagement.js"
import { refreshUserCredit } from "./cronRefreshUserCredit.js"
import { cronLogger } from "./../logger/cronLogger.js"


/* Pense-bete setup cron schedule 
// ┌───────────── seconde (0 - 59)
// │ ┌───────────── minute (0 - 59)
// │ │ ┌───────────── heure (0 - 23)
// │ │ │ ┌───────────── jour du mois (1 - 31)
// │ │ │ │ ┌───────────── mois (1 - 12)
// │ │ │ │ │ ┌───────────── jour de la semaine (0 - 7) (0 ou 7 = dimanche)
// │ │ │ │ │ │ ┌────────────── année (optionnel)
// │ │ │ │ │ │ |
// * * * * * * *
*/
const CRON_RESSOURCE = [
    {
        fonction: declencherNotificationsRdv,
        schedule: "0 0 * * * * * ", // Toutes les heures
        jobName: "Rappel de rendez-vous"
    },
    {
        fonction: managementTokenValidite,
        schedule: "0 */5 * * * * * ", // Toutes les 5 minutes
        jobName: "Management des Tokens"
    },
    {
        fonction: refreshUserCredit,
        schedule: "0 0 */6 * * * * ", //Toutes les 6 heures
        jobName: "Refresh Credit User"
    }
]


function initCron({ timeLine, Fn, jobName }) {
    const task = cron.schedule(timeLine, async () => {
        try {
            const process = await Fn()

            const message = {
                date: new Date().toLocaleString(),
                jobName,
                data: process ?? "aucun resultat"
            }

            cronLogger(message)
        } catch (error) {
            cronLogger({
                date: new Date().toLocaleString(),
                jobName,
                error
            })
            return false
        }
    }, { schedule: true })

    return task
}


export const startCronTask = async (started) => {
    if (!started) return

    CRON_RESSOURCE.forEach((task) => {
        initCron({
            timeLine: task.schedule,
            Fn: task.fonction,
            jobName: task.jobName
        })
    })
}

