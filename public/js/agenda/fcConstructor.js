async function getKlendyxRdv(host) {
    const res = await fetch(`${host}/api/rdv/get`, {
        method: 'GET',
    });
    const data = await res.json();
    return data
}

async function getGoogleCalendar(host) {
    const res = await fetch(`${host}/api/calendar/google/get`, {
        method: 'GET',
    });
    const data = await res.json();
    if (!data.success || data.err === "droit acces") {
        $("#message-alert-information").append(`<p>${data.message} <a href="${host}/api/calendar/auth">ici</a></p>`).css("display", "block"),
            $("#sync-google").text("Votre agenda google n'est plus synchronisé")
        checkCalendarSync(host)
        return
    }
    return data
}

function combineDateAndTime(date, timeString) {
    const [h, m] = timeString.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d;
}

function addEventDrop(start, end, el, info) {
    info.view.calendar.addEvent({
        start,
        end,
        allDay: false,
        title: el.dataset.title,
        color: "white",
        backgroundColor: "#3788d8",
        textColor: "white",
        id: el.dataset.title,
        extendedProps: {
            description: el.dataset.description,
            calendarSave: JSON.parse(el.dataset.calendarsave),
            image: JSON.parse(el.dataset.image)
        }
    });
}

async function createEventGoogle(host, summary, description, dateStart, dateEnd) {
    dateStart = formatDateRfc3339(dateStart)
    dateEnd = formatDateRfc3339(dateEnd)
    const res = await fetch(`${host}/api/calendar/google/create`, {
        method: "POST",

        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            summary,
            description,
            dateStart,
            dateEnd
        })
    })
    const data = await res.json()
    if (!data.success) {
        createClassiqueModale(data.message)
    }
}

async function checkCalendarSync(host) {
    const googleSync = await fetch(`${host}/api/calendar/google/sync`, {
        method: "GET",
        "Content-type": "application/json"
    })
    const dataGoogle = await googleSync.json()
    const google = dataGoogle.success

    const apple = false;
    const outlook = false;

    const addClassBadge = (calendar, state) => state ? $(`#sync-${calendar}`).addClass("badge-sync-confirm").text("Actif") : $(`#sync-${calendar}`).addClass("badge-sync-none").text("Inactif")
    const addButtonSync = (calendar, state) => {if(!state) $(`#items-calendar-sync-${calendar}`).append(`<span style="margin-left:4px" class="btn-sync-calendar" id="btn-sync-calendar-${calendar}">Synchroniser</span>`)}
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


    return {
        google,
        apple,
        outlook
    }
}



$(document).ready(async () => {

    let config = await getConfig()
    let host = config.host
    const today = Date.now()

    // ====== Init du calendrier ======

    //Constructeur calendar
    const calendarEl = document.getElementById('calendar');
    window.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayMaxEvents: 3,
        locale: 'fr',
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
            console.log(info)
            createModaleDetailEvent(info)
        },

        drop: (info) => {
            const el = info.draggedEl
            const dateStart = combineDateAndTime(info.date, el.dataset.start);
            const dateEnd = combineDateAndTime(info.date, el.dataset.end);
            const calendarSave = JSON.parse(el.dataset.calendarsave);
            const summary = el.dataset.title
            const description = el.dataset.describe
            console.log(calendarSave)
            if (calendarSave.calendyx) {
                console.log("calendyx")
            }
            if (calendarSave.google) {
                createEventGoogle(host, summary, description, dateStart, dateEnd);
            }
            if (calendarSave.apple) {
                console.log("apple")
            }
            if(calendarSave.outlook){
                console.log("outlook")
            }
            addEventDrop(dateStart, dateEnd, el, info)
        },

        dateClick: (info) => {
            //Modale clique sur un day retirer la fonctionalité?
            //createFcDayModale(info)
        }
    });

    //premier rendu por l'ui le temps d'avoir get les données
    window.calendar.render()


    //Check les calendar sync
    const calendarSync = await checkCalendarSync(host)

    // ====== Rempli le canlendar avec la data
    let turn = 0;
    if (calendarSync.google) {
        const eventDataGoogle = await getGoogleCalendar(host)
        eventDataGoogle.events.data.items.map((element) => {
            window.calendar.addEvent({
                allDay: !!element.start.date,
                start: element.start.dateTime || element.start.date,
                end: element.end.dateTime || element.end.date,

                id: element.id,
                title: element.summary,
                extendedProps: {
                    data: element,
                    origin: "google",
                },

                color: "white",
                backgroundColor: "#3788d8",
                textColor: "white",

                editable: false,
                order: turn,
            })
            turn++
        })
    }
    const eventCalendyx = await getKlendyxRdv(host)


    window.calendar.batchRendering(() => {
        //calendyx
        if (eventCalendyx.event) {
            eventCalendyx.event.data.map((element) => {
                window.calendar.addEvent({
                    start: element.dateDebut,
                    end: element.dateFin,

                    title: element.titleEvent,
                    id: element.id,

                    extendedProps: {
                        data: element,
                        description: element.messageEvent,
                        origin: "calendyx",
                    },

                    backgroundColor: "#3788d8",
                    textColor: "white",
                    borderColor: "pink",
                    editable: false,
                    order: turn,
                })
                turn++
            })
        }
    })



    window.calendar.render();

})

