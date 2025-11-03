$(async function () {

    const arrayContact = [];

    // Ajout de contact
    $("#btn-add-contact").on("click", (e) => {
        e.preventDefault()

        const contact = $("#input-email-contact").val()
        arrayContact.push(contact)


        $("#list-contact-send").append(`<li id="contact-${arrayContact.length}"></li>`)
        $(`#contact-${arrayContact.length}`).text(contact)
    })





    //lancement de la procedure 
    $("#btn-submit-matching-event").on("click", async (e) => {
        e.preventDefault();
        const config = await getConfig()
        const host = config.host

        //selectionne les events dans la plage de date
        const rangeMin = $("#range-min").val()
        const rangeMax = $("#range-max").val()
        const resEventGoogle = await fetch(
            `${host}/api/calendar/google/get?rangeMin=${encodeURIComponent(rangeMin)}&rangeMax=${encodeURIComponent(rangeMax)}`,
            {
                method: "GET"
            });
        const dataEventGoogle = await resEventGoogle.json()

        const undisponibility = [];
        const contact = [];

        dataEventGoogle.events.data.items.forEach((e) => {
            undisponibility.push({
                start: e.start.dateTime,
                end: e.end.dateTime,
            })
        })

        console.log(undisponibility)

        const listContact = $("#list-contact-send").children();
        for (let i = 0; i < listContact.length; i++) {
            contact.push($(`#contact-${i + 1}`).text())
        }

        //Lance la machine
        const res = await fetch(`${host}/api/event/matching-event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eventTitle: $("#event-title").val(),
                description: $("#event-describe").val(),
                eventAddress: $("#event-adress").val() ?? null,
                contact: contact,
                rangeStart: rangeMin,
                rangeEnd: rangeMax,
                durationEvent: $("#event-duration").val(),
                undisponibility: undisponibility,
            })
        })

        const data = await res.json()
        console.log(data)
    })
})




