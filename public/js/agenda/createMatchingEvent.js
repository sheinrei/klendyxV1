async function createMatchingEvent(host, contact, rangeMin, rangeMax, undisponibility) {
    const res = await fetch(`${host}/api/event/matching-event/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            eventTitle: escapeHtml($("#event-title").val()),
            description: escapeHtml($("#event-describe").val()),
            eventAddress: escapeHtml($("#event-adress").val() ?? null),
            contact: contact,
            rangeStart: rangeMin,
            rangeEnd: rangeMax,
            durationEvent: $("#event-duration").val(),
            undisponibility: undisponibility,

            rangeHoursStart: $("#range-hours-min").val(),
            rangeHoursEnd: $("#range-hours-max").val()
        })
    })

    const data = await res.json()
    
    if (data.success) {
        createClassiqueModale(`${data.messageHtml}`)
    }
    return data
}

async function getEventGoogleInterval(host, rangeMin, rangeMax) {
    const resEventGoogle = await fetch(
        `${host}/api/calendar/google/get?rangeMin=${encodeURIComponent(rangeMin)}&rangeMax=${encodeURIComponent(rangeMax)}`,
        {
            method: "GET"
        });
    const dataEventGoogle = await resEventGoogle.json()
    return dataEventGoogle
}

function hydrateJsonUndispo(dataEventGoogle) {
    const contact = ["origin"];
    const listContact = $("#list-contact-send").children();
    const undisponibility = {};

    for (let i = 0; i < listContact.length; i++) {
        contact.push(escapeHtml($(`#contact-${i + 1}`).text()))
    }
    for (let i = 0; i < contact.length; i++) {
        undisponibility[contact[i]] = {
            validate: contact[i] === "origin" ? true : false,
            disponible: [],
            indisponible: [],
            preference: []
        }
    }

    dataEventGoogle?.events?.data?.items.forEach((e) => {
        const start = e.start.dateTime || e.start.date;
        const end = e.end.dateTime || e.end.date;
        undisponibility["origin"].indisponible.push({ start, end });
    })
    contact.shift()
    return undisponibility
}

function setContact() {
    const listContact = $("#list-contact-send").children();
    const contact = []
    for (let i = 0; i < listContact.length; i++) {
        contact.push(escapeHtml($(`#contact-${i + 1}`).text()))
    }
    return contact
}

function controlleInput(){
    const title = $("#event-title").val()
    if(title.length < 1){
        createClassiqueModale("Veuillez renseigner un titre")
        return false
    }
    const listContact = $("#list-contact-send").children();
    if(listContact.length < 1){
        createClassiqueModale("Veuillez saisir au moin un destinataire")
        return false
    }
    const rangeMax = $("#range-max").val()
    if(!rangeMax){
        createClassiqueModale("Veuillez saisir une date de fin dans la période")
        return false
    }
    return true
}

function resetDomAfterSubmit(today){
    $("#event-title").val("");
    $("#event-adress").val("");
    $("#event-describe").val("");
    $("#input-email-contact").val("");

    $("#event-duration").val("1");
    $("#range-hours-min").val("9")
    $("#range-hours-max").val("18")

    $("#range-min").val(today);
    $("#range-max").val("")

    const listContact = $("#list-contact-send").children();
    for(let i =0 ; i < listContact.length ; i++){
        $(`#contact-${i+1}`).remove()
    }
}



$(async function () {
    const arrayContact = [];

    // === UX ===
    const today = new Date().toISOString().split("T")[0]
    $("#range-min").val(today)


    // Ajout de contact
    $("#btn-add-contact").on("click", (e) => {
        e.preventDefault()
        const email = $("#input-email-contact").val()
        const valide = validateEmail(email)
        if(!valide){
            createClassiqueModale("Veuillez saisir un email valide")
            return
        }
        arrayContact.push(email)
        $("#list-contact-send").append(`<p style="width:100%; margin:0" id="contact-${arrayContact.length}"></p>`)
        $(`#contact-${arrayContact.length}`).text(email)
        $("#input-email-contact").val("")
    })



    //lancement de la process
    $("#btn-submit-matching-event").on("click", async (e) => {
        e.preventDefault();
        const validInput = controlleInput()
        if(!validInput) return

        const config = await getConfig()
        const host = config.host

        //selectionne les events dans la plage de date
        const rangeMin = $("#range-min").val()
        const rangeMax = $("#range-max").val()

        const contact = setContact()
        const dataEventGoogle = await getEventGoogleInterval(host, rangeMin, rangeMax)
        const undisponibility = hydrateJsonUndispo(dataEventGoogle);
        //Lance la machine
        const create = await createMatchingEvent(host, contact, rangeMin, rangeMax, undisponibility)
        if(create.success){
            resetDomAfterSubmit(today)
        }

    })
})




