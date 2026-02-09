
async function fetchProvider(host, provider) {
    const res = await fetch(`${host}/api/calendar/get-events`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            provider
        })
    });
    const data = await res.json();
    return data
}

async function getCalendarEvents(host, calendarSync) {
    const providers = ["google", "outlook", "apple", "klendyx"]
    const promises = providers
        .filter(p => calendarSync[p]?.sync)
        .map(async provider => {
            const data = await fetchProvider(host, provider)
            return [provider, data]
        })

    const results = await Promise.all(promises)
    return Object.fromEntries(results)
}


function combineDateAndTimeLocal(date, timeString) {
    const [h, m] = timeString.split(":").map(Number);

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based
    const day = date.getDate();

    // ⚠️ Date locale explicite
    return new Date(year, month, day, h, m, 0, 0);
}



function createNewEventFC(eventData, turn) {
    const dateStart = new Date(eventData.dateStart);
    const dateEnd = new Date(eventData.dateEnd);

    window.calendar.addEvent({
        start: dateStart,
        end: dateEnd,
        title: eventData.title,
        id: `event-${turn}`,

        extendedProps: {
            providerId: eventData.eventId,
            data: eventData,
            description: eventData.description,
            origin: eventData.origin,
            fcId : `event-${turn}`,
        },

        backgroundColor: "#3788d8",
        textColor: "white",
        borderColor: "pink",
        editable: false,
        order: turn,
    })
}


async function createNewEventInProvider(host, provider, eventData) {
    try {
        const createdEvent = await fetch(`${host}/api/calendar/create`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                provider,
                eventData
            })
        })
        const res = await createdEvent.json();
        createClassiqueModale(res.data.message)
    } catch (err) {
        console.log(err)
    }
}


async function setDOMCalendarSync(calendarSync) {
    const google = calendarSync.google.sync;
    const apple = calendarSync.apple.sync;
    const outlook = calendarSync.outlook.sync;

    const addClassBadge = (calendar, state) => state ? $(`#sync-${calendar}`).addClass("badge-sync-confirm").text("Actif") : $(`#sync-${calendar}`).addClass("badge-sync-none").text("Inactif")
    const addButtonSync = (calendar, state) => { if (!state) $(`#items-calendar-sync-${calendar}`).append(`<span style="margin-left:4px" class="btn-sync-calendar" id="btn-sync-calendar-${calendar}">Synchroniser</span>`) }
    addClassBadge("google", google)
    addClassBadge("apple", apple)
    addClassBadge("outlook", outlook)

    addButtonSync("google", google)
    addButtonSync("apple", apple)
    addButtonSync("outlook", outlook)

    if (!google) {
        $("#external-calendar-save-google").remove()
    }
    if (!apple) {
        $("#external-calendar-save-apple").remove()
    }
    if (!outlook) {
        $("#external-calendar-save-outlook").remove()
    }


    const externalFav = $(".frame-external-fc").children()
    //retirer les extarnal fav qui envoient sur un agenda non sync
    for (let i = 0; i < externalFav.length; i++) {
        const el = $(externalFav[i]).children()[0]
        const calendarSave = JSON.parse(el.dataset.calendarsave);

        const externalGoogle = calendarSave.google
        const externalApple = calendarSave.apple
        const externalOutlook = calendarSave.outlook
        if (!google && externalGoogle) {
            $(externalFav[i]).remove()
        }
        if (!apple && externalApple) {
            $(externalFav[i]).remove()
        }
        if (!outlook && externalOutlook) {
            $(externalFav[i]).remove()
        }
    }
}



$(document).ready(async () => {
    let config = await getConfig()
    let host = config.host
    const today = Date.now()



    // ====== Init du calendrier ======

    //Constructeur calendar
    const calendarEl = document.getElementById('calendar');
    let turn = 0;
    window.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayMaxEvents: 3,
        locale: 'fr',
        timeZone: "local",
        contentHeight: "auto",
        headerToolbar: {
            left: 'prev next',
            center: 'title',
            right: "dayGridWeek,dayGridMonth"
        },
        buttonText: {
            today: "Aujourd'hui",
            week: "Semaine",
            month: "Mois",
        },
        firstDay: 1,
        editable: false,
        eventOrder: "order",
        validRange: {
            start: today
        },
        eventClick: (info) => {
            createModaleDetailEvent(info)
        },

        drop: (info) => {
            const el = info.draggedEl
            const calendarSave = JSON.parse(el.dataset.calendarsave);

            const startLocal = combineDateAndTimeLocal(info.date, el.dataset.start);
            const endLocal = combineDateAndTimeLocal(info.date, el.dataset.end);

            const eventData = {
                dateStart: startLocal.toISOString(),
                dateEnd: endLocal.toISOString(),
                title: el.dataset.title,
                description: el.dataset.describe,
            }

            if (calendarSave.klendyx) {
                createNewEventInProvider(host, "klendyx", eventData);
                createNewEventFC(eventData, turn)
                turn++
            }
            if (calendarSave.google) {
                createNewEventInProvider(host, "google", eventData);
                createNewEventFC(eventData, turn)
                turn++
            }
            if (calendarSave.apple) {
                createNewEventInProvider(host, "apple", eventData);
                createNewEventFC(eventData, turn)
                turn++
            }
            if (calendarSave.outlook) {
                createNewEventInProvider(host, "outlook", eventData);
                createNewEventFC(eventData, turn)
                turn++
            }
        },

        dateClick: (info) => {
            //Modale clique sur un day retirer la fonctionalité?
            //createFcDayModale(info)
        }
    });




    //premier rendu por l'ui le temps d'avoir get les données
    window.calendar.render()

    //rechercher les calendars sync
    const calendarSync = await checkCalendarSync(host);
    setDOMCalendarSync(calendarSync)
    const allEvents = await getCalendarEvents(host, calendarSync);


    // ====== Rempli le canlendar avec la data
    window.calendar.batchRendering(() => {
        for (const [key, val] of Object.entries(allEvents)) {
            const events = allEvents[key].data.data.events
            events.forEach(event => {
                createNewEventFC(event, turn)
                turn++
            })
        }

    })
    window.calendar.render()

})





