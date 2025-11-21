
const parseStrDateToHours = date => date.split(" ")[0].replace(":", "h").slice(0, 5)
const parseDateToFrench = day => day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const firstToUpper = str => str.toUpperCase().slice(0, 1) + str.slice(1)

async function getDataEvent(urlToken, host) {
    const res = await fetch(`${host}/api/event/matching-event/get?token=${urlToken}`, {
        method: "GET",
    })
    let dataMatchingEvent = await res.json();

    if (!dataMatchingEvent.success) {
        createClassiqueModale("Cet évènement n'est pas valide, vous allez être redirigé vers la page d'accueil")
        $("#btn-confirm-classique-modale").remove()
        setTimeout(
            () => window.location.href = `${host}/index`, 2500
        )
    }

    return dataMatchingEvent
}

async function getEventGoogle(host, rangeStart, rangeEnd) {
    const rangeEndInclude = new Date(rangeEnd);
    rangeEndInclude.setUTCDate(rangeEndInclude.getUTCDate() + 1);
    rangeEndInclude.setUTCHours(0, 0, 0, 0);

    const rangeEndMax = rangeEndInclude.toISOString()

    const resEventGoogle = await fetch(`${host}/api/calendar/google/get/invite?rangeMin=${rangeStart}&rangeMax=${rangeEndMax}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const dataEventGoogle = await resEventGoogle.json()
    return dataEventGoogle
}

function addEventToFC(calendar, events) {
    events.forEach((event) => {
        calendar.addEvent({
            title: event.summary,
            start: event.start.dateTime,
            end: event.end.dateTime,
            color: "white",
            extendedProps: event
        })
    })
    calendar.render()
}

function setEventDragable(color) {
    // === Event dragable ===
    const containerEl = document.getElementById("external-events")
    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
            if (eventEl.innerText === "Disponible") {
                return {
                    title: "Disponible",
                    id: eventEl,
                    start: eventEl,
                    display: "background",
                    color: color.bgDispo,
                    borderColor: "#008000",
                }
            }
            if (eventEl.innerText === "Date de préférence") {
                return {
                    title: "Preference",
                    id: eventEl,
                    start: eventEl,
                    display: "background",
                    color: color.bgDispoPref,
                    borderColor: "#004687",
                }
            }
            if (eventEl.innerText === "Indisponible") {
                return {
                    title: "Indisponible",
                    id: eventEl,
                    start: eventEl,
                    display: "background",
                    color: color.bgIndispo,
                    borderColor: "#800000"
                }
            }
        }
    });
}

function setFcCalendar(dayStart, dayEnd) {
    // === Creation du Calendar ===
    const calendarEl = document.getElementById('calendar');
    let fcRight = "";
    let fcLeft = ""
    const sameMonth = new Date(dayStart).getMonth() === new Date(dayEnd).getMonth()

    if (!sameMonth) {
        fcRight += "dayGridWeek,dayGridMonth"
        fcLeft = "prev next"
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayMaxEvents: 3,
        locale: 'fr',
        contentHeight: "auto",
        firstDay: 1,
        editable: true,
        eventOrder: "order",
        headerToolbar: {
            left: fcLeft,
            center: 'title',
            right: fcRight
        },
        validRange: {
            start: dayStart,
            end: dayEnd
        },
        eventClick: (info) => {
            const title = info.event.title
            if (title === "Indisponible" || title === "Disponible" || title === "Preference") {
                createModaleEvent(info)
            } else {
                createModaleGoogleEvent(info)
            }

        }
    });
    calendar.render()
    return calendar
}

function createModaleEvent(info) {
    const strDate = firstToUpper(parseDateToFrench(new Date(info.event.start)))
    const start = parseStrDateToHours(new Date(info.event.start).toTimeString())
    const end = parseStrDateToHours(new Date(info.event.end).toTimeString())

    const dateStyle = `width:fit-content;
    position:relative;
    right:-25%;
    text-align:center;
    font-size:22px;
    margin-bottom:40px;
    border-bottom:1px solid #DCDCDC`


    const style = {
        Indisponible: `background-color: #F08080`,
        Disponible: `background-color: #ADFF2F`,
        Preference: `background-color: #00BFFF`
    }
    console.log(info.event.title)

    const period = info.event.allDay ? "Toute la journée" : `De ${start} à ${end}`
    const html = `<div>
                    <p style="${dateStyle}"><strong>${strDate}</strong></p>
                    <p>Status : <span style="${style[info.event.title]}; padding:4px 7px; font-weight:500; border-radius:15px; margin-bottom:10px">${info.event.title}</span></p>
                    <p>Période : ${period}</p>
                </div>`
    createClassiqueModale(html)

    $(".classique-modale-footer").append(`<button class='btn btn-delete' id='btn-delete-event/${info.event.id}'>Supprimer</button>`)
}

function createModaleGoogleEvent(info) {

    const strDate = firstToUpper(parseDateToFrench(new Date(info.event.start)))
    const start = parseStrDateToHours(new Date(info.event.start).toTimeString())
    const end = parseStrDateToHours(new Date(info.event.end).toTimeString())
    const description = info.event._def.extendedProps.description
    const dateStyle = `width:fit-content;
    position:relative;
    right:-25%;
    text-align:center;
    font-size:22px;
    margin-bottom:40px;
    border-bottom:1px solid #DCDCDC`

    const period = info.event.allDay ? "Toute la journée" : `De ${start} à ${end}`
    const html = `<div>
                    <p style="${dateStyle}"><strong>${strDate}</strong></p>
                    <p>Titre : ${info.event.title}</p>
                    <p>Période : ${period}</p>
                    <p>Description : ${description}
                </div>`
    createClassiqueModale(html)
}
//Ajout indispo pour tout les jours entre interval dans le DOM et EventFC
function addDaysEventIndispo(dayNumber, state, dayStart, dayEnd, color, calendar) {
    const dayInInterval = [];
    const date = new Date(dayStart);
    while (date <= new Date(dayEnd)) {
        if (date.getDay() === dayNumber) {
            dayInInterval.push(date.toISOString().split('T')[0]);
        }
        date.setDate(date.getDate() + 1);
    }

    if (state) {
        dayInInterval.forEach((e) => {
            calendar.addEvent({
                id: e,
                title: "Indisponible",
                start: e,
                display: "background",
                color: color.bgIndispo,
            })
        })
    } else {
        dayInInterval.forEach((e) => {
            const event = calendar.getEventById(e)
            event.remove()
        })
    }
}

//Ajout dans le FC des events sur une plage horraire
function addDaysEventDispoHorraire(dayNumber, setup, hourStart, hourEnd, dayStart, dayEnd, color, calendar) {
    const dayInInterval = [];
    const startDate = new Date(dayStart);
    const endDate = new Date(dayEnd);
    const date = new Date(startDate);


    while (date <= endDate) {
        if (dayNumber.includes(date.getDay())) {
            dayInInterval.push(date.toISOString().split('T')[0]);
        }
        date.setDate(date.getDate() + 1);
    }

    const parametre = {
        "disponible": {
            title: "Disponible",
            color: color.bgDispo
        },
        indisponible: {
            title: "Indisponible",
            color: color.bgIndispo
        },
        preference: {
            title: "Preference",
            color: color.bgDispoPref
        }
    }


    dayInInterval.forEach((day) => {
        calendar.addEvent({
            id: day,
            title: parametre[setup].title,
            start: `${day}T${hourStart}:00`,
            end: `${day}T${hourEnd}:00`,
            color: parametre[setup].color,
        });
    });
};

function hydraterJsonUndisponibility(json, calendar, origin) {
    const allEvent = calendar.getEvents()
    allEvent.forEach((e) => {
        console.log(e)
        const title = e._def.title
        let start = e.start
        let end = e.end
        const allDay = e.allDay
        if (allDay) {
            start = start.toLocaleDateString('fr-CA')
            end = null
        }
        switch (title) {
            case "Disponible":
                json[origin].disponible.push({ start, end, allDay });
                break
            case "Indisponible":
                json[origin].indisponible.push({ start, end, allDay });
                break
            case "Preference":
                json[origin].preference.push({ start, end, allDay });
                break
            default:
                json[origin].indisponible.push({start : e.startStr, end : e.endStr, allDay})
        }
    })

    json[origin].validate = true
    return json
}

async function updateJsonUndisponibility(host, undisponibility, urlToken) {
    const updateJson = await fetch(`${host}/api/event/matching-event/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            undisponibility: undisponibility,
            token: urlToken
        })
    })
    const updated = await updateJson.json()
    return updated
}


// === Main ===
$(async () => {
    // === Init ===

    //Start cherche la data pour init
    const url = window.location.href
    const urlToken = url.split("/")[4]
    const origin = url.split("/")[5]

    const config = await getConfig()
    const host = config.host

    //Chercher la data event depuis le token
    const dataMatchingEvent = await getDataEvent(urlToken, host)

    //Setup calendar
    const dayStart = dataMatchingEvent.event.data.rangeStart
    const dayEnd = dataMatchingEvent.event.data.rangeEnd

    const color = {
        bgDispo: "#ADFF2F",
        bgIndispo: "#F08080",
        bgDispoPref: "#00BFFF",

    }

    //Calendar
    const calendar = setFcCalendar(dayStart, dayEnd, color)
    setEventDragable(color)


    // === EventListener ===

    // === Gestion Dom checkbox day créations title: "Non disponible" ===
    const days = [
        { id: "lundi", numberDay: 1 },
        { id: "mardi", numberDay: 2 },
        { id: "mercredi", numberDay: 3 },
        { id: "jeudi", numberDay: 4 },
        { id: "vendredi", numberDay: 5 },
        { id: "samedi", numberDay: 6 },
        { id: "dimanche", numberDay: 0 }
    ];
    days.forEach(day => {
        $(`#${day.id}`).on("click", () => {
            const state = $(`#${day.id}`).is(":checked");
            $(`#label-${day.id}`).css("backgroundColor", state ? "#FFB2B2" : "white")
            addDaysEventIndispo(day.numberDay, state, dayStart, dayEnd, color, calendar);
        });
    });


    //Gestion des plage horraires
    //Gestion color du label feat checkbox
    days.forEach(day => {
        $(`#horraire-${day.id}`).on("click", () => {
            const state = $(`#horraire-${day.id}`).is(":checked");
            $(`#label-horraire-${day.id}`).css("background", state ? "linear-gradient(135deg, #007bff 0%, #0056b3 100%)" : "white")
        })
    })

    //Ajout dans les events
    $("#btn-submit-horraire").on("click", (e) => {
        e.preventDefault();
        const arrayDays = [];

        days.forEach((day) => {
            if ($(`#horraire-${day.id}`).is(":checked")) {
                arrayDays.push(day.numberDay)
            }
        })

        const setupDisponible = $("#plage-horraire-setup-disponible").is(":checked")
        const setupIndisponible = $("#plage-horraire-setup-indisponible").is(":checked")
        const setupPreference = $("#plage-horraire-setup-preference").is(":checked")

        const horraireStart = $("#horraire-time-start").val()
        const horraireEnd = $("#horraire-time-end").val()
        if (setupDisponible) addDaysEventDispoHorraire(arrayDays, "disponible", horraireStart, horraireEnd, dayStart, dayEnd, color, calendar)
        if (setupIndisponible) addDaysEventDispoHorraire(arrayDays, "indisponible", horraireStart, horraireEnd, dayStart, dayEnd, color, calendar)
        if (setupPreference) addDaysEventDispoHorraire(arrayDays, "preference", horraireStart, horraireEnd, dayStart, dayEnd, color, calendar)

        //remise à 0 de l'affichage des labels
        days.forEach((day) => {
            $(`#horraire-${day.id}`).prop("checked", false);
            $(`#label-horraire-${day.id}`).css("backgroundColor", "white")
        })
    })


    //supprimer un event du calendar
    $(document).on("click", ".btn-delete", () => {
        const el = $(".btn-delete")[0]
        const id = el.id.split("/")[1]
        const event = calendar.getEventById(id)
        event.remove()
        $("#btn-close-classique-modale").click()
    })


    // Final ->  validation des disponibilitées
    $("#btn-submit-matching").on("click", async () => {
        //reprendre le json de l'event 
        const json = dataMatchingEvent.event.data.undisponibility

        //ajouter les evet/dispo/indispo dans le json undispo
        const jsonUpdated = hydraterJsonUndisponibility(json, calendar, origin)
        console.log(jsonUpdated)


        //Mettre à jours dans la base
        const updated = await updateJsonUndisponibility(host, jsonUpdated, urlToken)
        if (updated.success){
            scrollTo(0, 0)
            $("#message-alert").css("display", "block").text("Vos disponibilités ont bien été mises à jour. Vous recevrez une notification par email lorsque la date de cet événement aura été déterminée.")
            $("#btn-submit-matching").remove()
        }
    })


    // == deplier la frame sync google ==
    let syncGoogleToogle = true
    $("#retract-sync-google").on("click", function (e) {
        const src = syncGoogleToogle ? "https://img.icons8.com/color/50/circled-chevron-down.png" : "https://img.icons8.com/fluency/48/circled-chevron-up.png"
        e.preventDefault()
        $(this).attr("src", src)
        syncGoogleToogle = !syncGoogleToogle
        $(".sync-content").slideToggle(300);
    })

    // === sync des event google ===
    $("#sync-google").on("click", async () => {
        window.localStorage.setItem("redirect", url)
        window.location.href = `${host}/api/calendar/google/auth/invite`
    })

    // === Recuperation des events google === 
    if (window.localStorage.getItem("redirect")) {
        const resEventGoogle = await getEventGoogle(host, dayStart, dayEnd);
        addEventToFC(calendar, resEventGoogle.events.data.items)
        window.localStorage.removeItem("redirect")
    }
})
