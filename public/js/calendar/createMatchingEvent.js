$(async function () {
    const arrayContact = [];

    // === UX ===
    const today = new Date().toISOString().split("T")[0]
    $("#range-min").val(today)


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

        const undisponibility = {};
        const contact = ["origin"];


        const listContact = $("#list-contact-send").children();
        for (let i = 0; i < listContact.length; i++) {
            contact.push($(`#contact-${i + 1}`).text())
        }

        for (let i = 0; i < contact.length; i++) {
            undisponibility[contact[i]] = {
                validate : contact[i] === "origin" ? true : false,
                disponible: [],
                indisponible: [],
                preference: []
            }
        }

        dataEventGoogle.events.data.items.forEach((e) => {
            const start = e.start.dateTime || e.start.date;
            const end = e.end.dateTime || e.end.date;
            undisponibility["origin"].indisponible.push({ start, end });
        })


        contact.shift()
        //Lance la machine
        const res = await fetch(`${host}/api/event/matching-event/create`, {
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

                rangeHoursStart : $("#range-hours-min").val(),
                rangeHoursEnd : $("#range-hours-max").val()
            })
        })

        const data = await res.json()
        if(data.success){
            createClassiqueModale(`${data.message}`)
        }
    })
})




