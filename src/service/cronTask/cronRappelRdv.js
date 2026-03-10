import { getAllRappelRdv } from "../rappelRdv/getRappelRdv.js";
import db from "./../../sequelize.js";
import { SmsSender } from "../sms/smsSender.js";
import { KlendyxMailer } from "../mailer/ClassMailer.js";
import { updateRappelRdv } from "../rappelRdv/updateRappelRdv.js";




export async function declencherNotificationsRdv() {
    console.log("Lancement de la tache cron rappel de rendez-vous sending")
    try {

        //Récupération des data des rappel de rendez-vous dans la base de donnée
        const allRappelRdv = await getAllRappelRdv(db);

        if (!allRappelRdv.success) {
            throw new Error(allRappelRdv.error ?? allRappelRdv.message)
        }

        const rappelRdvData = allRappelRdv.data

        if (!rappelRdvData) {
            return {
                success: true,
                message: "Aucune ligne de rappel de rendez-vous en cours"
            }
        }



        const dataReturn = []
        const now = Date.now()
        //Logique métier
        for (const rappel of rappelRdvData) {
            const { phone, email, method, dayEvent, timeBefore, message, state, id } = rappel

            const date = new Date(dayEvent).getTime()
            const hourRappel = date - (timeBefore * 1000 * 60 * 60)

            const stateSending = {
                sms: state?.sms ?? { sent: false, sentAt: null, error: null },
                email: state?.email ?? { sent: false, sentAt: null, error: null }
            }



            //1. envoyer la notification

            // 1.1 définir la methode d'envoie
            const methodSms = method.includes("sms")
            const methodEmail = method.includes("email")
            const allChanelsSent = (!methodSms || state?.sms?.sent) && (!methodEmail || state?.email?.sent)

            if (!methodSms && !methodEmail) {
                console.warn(`Rappel id=${id} : aucune méthode d'envoi définie`)
                dataReturn.push({
                    id,
                    error : `Rappel id=${id} : aucune méthode d'envoi définie`
                })
                continue
            }

            if (now > hourRappel && !allChanelsSent) {

                //1.2.1 envoie sur le canal sms
                if (methodSms && !stateSending.sms.sent) {
                    try {
                        console.log("Envoie de la notification par sms")
                        const sender = new SmsSender(phone, message)
                        const result = await sender.sendSms()
                        stateSending.sms = {
                            sent: result.success,
                            sentAt: result.success ? new Date().toISOString() : null,
                            error: result.error || null
                        }
                    } catch (err) {
                        console.warn(`Erreur lors d'un envoie de sms, error : ${err}`);
                        stateSending.sms = {
                            sent: false,
                            sentAt: null,
                            error: err?.message ?? String(err)
                        }

                    }
                }

                //1.2.2 envoie sur le canal email
                if (methodEmail && !stateSending.email.sent) {
                    console.log("Envoie de la notification par email")
                    try {
                        const mailer = new KlendyxMailer(email)
                        const title = "Rappel de votre rendez-vous"
                        const result = await mailer.sendRappelRdv(title, `<div>${message}</div>`)
                        stateSending.email = {
                            sent: result.success,
                            sentAt: result.success ? new Date().toISOString() : null,
                            error: result.error || null
                        }

                    } catch (err) {
                        console.warn(`Une erreur est survenue lors de l'envoie d'un email, error : ${err} `)
                        stateSending.email = {
                            sent: false,
                            sentAt: null,
                            error: err?.message ?? String(err)
                        }
                    }

                }

                //2. Mettre à jours le success en update rvd
                await updateRappelRdv(id, { state: stateSending }, db)

                //3. remplir l'array de retour
                dataReturn.push({ id, state: stateSending })
            }
            //Fin de la boucle for
        }

        return {
            success: true,
            message: `Les rappel de rendez-vous sont finis pour ${rappelRdvData.length} élément `,
            resultat: dataReturn
        }

    } catch (err) {
        console.warn(`Une erreur est survenue lors de l'opération cron de declanchement notification d'un rendez-vous, error : ${err}`)
        return {
            success: false,
            message: `Une erreur est survenue lors de l'opération cron de declanchement notification d'un rendez-vous`,
            error: err?.message ?? String(err)
        }
    }
}