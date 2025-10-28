
$(document).ready(async () => {
    let token = window.localStorage.getItem("token")

    let config = await getConfig()
    let host = config.host

    //======  fetch des données  =======
    async function getGoogleCalendar() {
        const res = await fetch(`${host}/api/calendar/google/get`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token,
            },
        });
        const data = await res.json();
        if (!data.success && data.err === "droit acces") {
            $("#message-alert").append(`<p>${data.message} <a href="${host}/api/calendar/auth/${window.localStorage.getItem("token")}">ici</a></p>`)
            return
        }
        return data
    }

    async function getCalendyxEvents() {
        const res = await fetch(`${host}/api/event/get`, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token,
            },
        });
        const data = await res.json();
        return data
    }


    // ====== Init du calendrier ======
    const calendarEl = document.getElementById('calendar');
    const containerEl = document.getElementById("external-events")

    // Rend les éléments "draggables"
    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
            return {
                title: eventEl.innerText.trim()
            }
        }
    });

    //Constructeur calendar
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
        eventClick: (info) => {
            info.jsEvent.preventDefault()
            createModale(info)
        },

        drop: (info) => {
            createFcDayModale(info)
        },

        dateClick: (info) => {
            createFcDayModale(info)
        }
    });

    window.calendar.render()

    // ====== Rempli le canlendar avec la data
    const eventDataGoogle = await getGoogleCalendar()
    const eventCalendyx = await getCalendyxEvents()

    let turn = 0;

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

        //google
        if (eventDataGoogle.events) {
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
    })



    window.calendar.render();

})

