import { Credit } from "../credit/ClassCredit.js"




const CREDIT_RESSOURCE = [
    { title: "essais gratuit", smsCredit: 5, emailCredit: 20 },
    { title: "starter", smsCredit: 50, emailCredit: 200 },
    { title: "pro", smsCredit: 200, emailCredit: 1000 },
    { title: "ultimate", smsCredit: 500, emailCredit: 99999 },
]



export async function refreshUserCredit() {
    console.log("Déclanchement du refresh de crédit users")
    const now = Date.now()

    const allCredit = await new Credit().getAllCredit()
    if (!allCredit.success) {
        return {
            success: false,
            message: `Echec lors de la récupération des crédits users`,
            error : allCredit?.error || allCredit?.message || "Aucune message d'erreur"
        }
    }
    const dataReturn = []

    for (const credit of allCredit.data) {
        try {
            const { plan, userId } = credit.dataValues

            //Setup du prochain en prenant en compte si plan gratuit on refresh d'une semaine au lieux d'un mois
            const nextRefreshTime = now + 1000 * 60 * 60 * 24 * (plan === "essais gratuit" ? 7 : 30)
            const newRefreshDate = new Date(nextRefreshTime)

            const planConfig = CREDIT_RESSOURCE.find(p => p.title === plan)

            if (!planConfig) {
                dataReturn.push({
                    success: false,
                    message: "Une erreur est survenue et n'avons pas pu mettre les crédits à jours",
                    error: `Plan inconnu : "${plan}" pour userId ${userId}`
                })
                continue
            }

            const updated = await new Credit(userId).updateUserCredit({
                sms: planConfig.smsCredit,
                email: planConfig.emailCredit,
                refreshAt: newRefreshDate,
            })

            dataReturn.push({ userId, success: updated.success, plan })


        } catch (err) {
            console.warn(`Echec lors de l'opération cron de refresh des crédits, error: ${err}`)
            dataReturn.push({
                userId: credit.dataValues.userId,
                success: false,
                error: err?.message ?? String(err)
            })
        }
    }

    return {
        success: true,
        message: `${dataReturn.length} crédit ont été refresh`,
        data: dataReturn
    }
}