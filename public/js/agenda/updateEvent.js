
$(document).on("click", "#btn-update-event", async function (e) {
    e.preventDefault();

    const extendedProps = $("#fc-ext-props").val()
    const data = JSON.parse(extendedProps);
    const fcId = $("#fc-id-event").val()
    console.log(fcId)

    const ObjectDateStart = new Date(data.dateStart)
    const ObjectDateEnd = new Date(data.dateEnd)
    const dateStart = ObjectDateStart.toLocaleTimeString()
    const dateEnd = ObjectDateEnd.toLocaleTimeString()
    const title = $("#eventTitle").text();

    console.log(dateStart)

    $(".event-info-grid").remove();
    const hourToHtmlValue = date => date.slice(0, 5)


    const html = `<div>

        <input type="hidden" id="fc-id-event" value="${fcId}" />
        <div class=""info-item">
            <p>Titre : </p>
            <input type="text" id="input-update-event-title" value="${title}"/>
        </div>

        <div class=""info-item">
            <p>Datet : </p>
            <input type="date" id="input-update-event-date" value="${data.dateStart.split("T")[0]}" />
        </div>


        <div class=""info-item">
            <p>Heure de début : </p>
            <input type="time" id="input-update-event-hour-start" value="${hourToHtmlValue(dateStart)}" />
        </div>

        <div class=""info-item">
            <p>Heure de fin : </p>
            <input type="time" id="input-update-event-hour-end" value="${hourToHtmlValue(dateEnd)}" />
        </div>

        <div class=""info-item">
            <p>Description : </p>
            <input type="text" id="input-update-event-description" value="${data.description}"/>
        </div>

    </div>`

    const btnSubmit = `<button class="btn btn-primary" id="btn-submit-update-event">Valider</button>`
    const btnBack = `<button class="btn-black" id="btn-back-update-event">Annuler</button>`
    $(".modal-body").prepend(html)
    $(".modal-footer").append(btnSubmit)
    $(".modal-footer").append(btnBack)
    $("#btn-update-event").remove()
    $("#btn-delete-event").remove()

    window.calendar.remove
})




$(document).on("click", "#btn-submit-update-event", async function (e) {
    e.preventDefault();

    const data = $("#fc-ext-props").val();

    const extendedProps = JSON.parse(data)


    const eventId = extendedProps.eventId;
    const provider = extendedProps.provider;


    const date = $("#input-update-event-date").val()
    const hourStart = $("#input-update-event-hour-start").val()
    const hourEnd = $("#input-update-event-hour-end").val()

    const dateStart = `${date}T${hourStart}:00`
    const dateEnd = `${date}T${hourEnd}:00`

    console.log(provider)

    const eventData = {
        dateStart,
        dateEnd,
        title: $("#input-update-event-title").val() || extendedProps.title,
        description: $("#input-update-event-description").val() || "",
        provider
    }


    let config = await getConfig()
    let host = config.host
    const updatedEvent = await fetch(`${host}/api/calendar/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            provider,
            eventData,
        })
    })

    const res = await updatedEvent.json();
    console.log(res)

    if (res.success) {
        const fcId = $("#fc-id-event").val()
        console.log("id fc : ",fcId)
        const event = window.calendar.getEventById(fcId)
        console.log(event)
        event.remove()
        const turn = fcId.replace("event-", "")

        $(".event-modale").remove();
        createNewEventFC(eventData, turn)
    }
    createClassiqueModale(res.message)
})




$(document).on("click", "#btn-back-update-event", function (e) {
    e.preventDefault();
    console.log("back")
})