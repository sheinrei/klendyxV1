
async function calendyxDeleteEvent(token, idEvent) {
    const config = await getConfig()
    const host = config.host

    const res = await fetch(`${host}/api/rdv/delete`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            eventId: idEvent
        })
    })

    const data = await res.json();
    return data
}

async function googleDeleteEvent(token, idEvent) {
    const config = await getConfig()
    const host = config.host

    
    const res = await fetch(`${host}/api/calendar/google/delete`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            eventId: idEvent
        })
    })

    const data = await res.json();
    return data
}




$(document).on("click", "#btn-delete-event", async () => {
    const token = window.localStorage.getItem("token")
    const origin = $("#origin-event").val()

    const idEvent = String($("#fc-event-id").val())
    const event = window.calendar.getEventById(idEvent)
    let deleted;
    switch (origin) {
        case "google":
            deleted = await googleDeleteEvent(token, idEvent);
            if (deleted.success) {
                $(".close-modale").closest(".event-modale").remove()
            }
            break
        case "calendyx":
            deleted = await calendyxDeleteEvent(token, idEvent)
            if (deleted.success) {
                $(".close-modale").closest(".event-modale").remove()
            }
            break
    }

    if (event && deleted.success) {
        event.remove()
    }

})
