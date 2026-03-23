async function createMatchingEvent(host, contact, rangeMin, rangeMax, undisponibility) {
    const res = await fetch(`${host}/api/matching-event/create`, {
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
        `${host}/api/calendar/get`,
        {
            method: "GET"
        });
    const dataEventGoogle = await resEventGoogle.json()
    return dataEventGoogle
}




/**
 * Preparre le json des indispo avec tout les contacts plus origin
 * @param {*} dataEvent 
 * @returns 
 */
function hydrateJsonUndispo(dataEvent) {
    const contact = ["origin"];
    const listContact = $(".contact-chip-email");
    const undisponibility = {};


    for (let i = 0; i < listContact.length; i++) {
        contact.push(escapeHtml($(listContact[i]).text()))
    }


    for (let i = 0; i < contact.length; i++) {
        undisponibility[contact[i]] = {
            validate: contact[i] === "origin" ? true : false,
            disponible: [],
            indisponible: [],
            preference: []
        }
    }

    dataEvent.forEach((e) => {
        const start = e._def.extendedProps.data.dateStart;
        const end = e._def.extendedProps.data.dateEnd;
        undisponibility["origin"].indisponible.push({ start, end });
    })
    contact.shift()
    console.log(undisponibility)
    return undisponibility
}






function setContact() {
    const listContact = $(".contact-chip-email");
    const contact = []
    for (let i = 0; i < listContact.length; i++) {
        contact.push(escapeHtml($(listContact[i]).text()))
    }
    return contact
}

function controlleInput() {
    const title = $("#event-title").val()
    if (title.length < 1) {
        createClassiqueModale("Veuillez renseigner un titre")
        return false
    }
    const listContact = $("#list-contact-send").children();
    if (listContact.length < 1) {
        createClassiqueModale("Veuillez saisir au moin un destinataire")
        return false
    }
    const rangeMax = $("#range-max").val()
    if (!rangeMax) {
        createClassiqueModale("Veuillez saisir une date de fin dans la période")
        return false
    }
    return true
}

function resetDomAfterSubmit(today) {
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
    for (let i = 0; i < listContact.length; i++) {
        $(`#contact-${i + 1}`).remove()
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
        if (!valide) {
            createClassiqueModale("Veuillez saisir un email valide")
            return
        }
        arrayContact.push(email)
        const htmlContact = `
        <div class="contact-chip">
            <span class="contact-chip-email">${email}</span>
            <button class="contact-chip-delete" type="button"
            aria-label="Supprimer l'email ${email} de la liste des participants" data-email="${email}">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `
        $("#list-contact-send").append(htmlContact)
        $("#input-email-contact").val("")
    })

    //suppression de contact
    $("body").on("click", ".contact-chip-delete", function () {

        const email = $(this).data("email")
        const index = arrayContact.indexOf(email)
        if (index !== -1) arrayContact.splice(index, 1)
        $(this).closest(".contact-chip").remove()
    })


    //lancement de la process
    $("#btn-submit-matching-event").on("click", async (e) => {
        e.preventDefault();
        const validInput = controlleInput()
        if (!validInput) return

        const config = await getConfig()
        const host = config.host

        //selectionne les events dans la plage de date
        const rangeMin = $("#range-min").val()
        const rangeMax = $("#range-max").val()

        const contact = setContact()


        //chercher les events dans l'interval de dispo
        const calendarEvents = window.calendar.getEvents()
        const eventinterval = calendarEvents.filter((event)=>{
            return(new Date(event.extendedProps.data.dateStart) > new Date(rangeMin)
            && new Date(event.extendedProps.data.dateEnd) < new Date(rangeMax))
        })

        //remplir le json undispo
        const undisponibility = hydrateJsonUndispo(eventinterval);
        //Lance la machine
        const create = await createMatchingEvent(host, contact, rangeMin, rangeMax, undisponibility)
        if (create.success) {
            resetDomAfterSubmit(today)
        }

    })
})




