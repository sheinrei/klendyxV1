async function getConfig() {
    try {
        const res = await fetch("/config");
        const data = await res.json();
        return {
            host: data.host,
        };
    } catch (err) {
        console.log(err)
    }
}


export async function getCurrentCredit() {

    try {
        const config = await getConfig()
        const host = config.host

        const res = await fetch(`${host}/api/credit/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const credit = await res.json()

        return {
            credit
        }

    } catch (err) {
        return {
            success: false,
            message: "Une erreur est survenue avec le seveur, veuillez réessayer plus tard"
        }
    }
}

export async function getDataCalendar(provider) {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/calendar/get-events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ provider })
        })
        const data = await res.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function getPropositionRdv() {
    try {
        const host = await getConfig()
        const res = await fetch(`${host.host}/api/rdv/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        return data.event


    } catch (err) {
        console.log(err)
    }
}