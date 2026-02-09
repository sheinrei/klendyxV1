

$(document).on("click", "#btn-delete-event", async () => {

    try {


        const data = $("#fc-ext-props").val();
        const extendedProps = JSON.parse(data)
        const fcId = $("#fc-id-event").val()
        const eventId = extendedProps.eventId
        const provider = extendedProps.provider

        const event = window.calendar.getEventById(fcId)

        let config = await getConfig()
        let host = config.host

        const deletedEvent = await fetch(`${host}/api/calendar/delete`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                provider,
                eventId
            })
        })
        const res = await deletedEvent.json();
        if (res.success) {
            event.remove();
            $(".event-modale").remove()
            createClassiqueModale(res.data.message)
        }
        console.log(res)
    } catch (err) {
        console.log(err)
    }

})
