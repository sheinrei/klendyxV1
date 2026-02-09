import cron from "node-cron"



export function initCron({ timeLine, Fn, jobName }) {

    const task = cron.schedule(timeLine, async () => {
        try {
            console.log(`[ CRON ] - job ${jobName} started`)
            await Fn()
        } catch (error) {
            console.log(`[ CRON ] - job ${jobName} failed error : ${error?.message}`)
            return false
        }
    }, { schedule: true })

    return task
}


export const cronTask = async (starteed) => {
    if (!cronStarted) return

    let CRON_SETUP = `*/10 * * * * * `

    initCron({
        timeLine: CRON_SETUP,
        Fn: () => console.log("hello"),
        jobName: "Logger"
    })
}