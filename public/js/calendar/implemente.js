
$(document).ready(async () => {
    let token = window.localStorage.getItem("token")

    //======  fetch des données  =======
    async function getGoogleCalendar() {
        const res = await fetch("http://localhost:3000/api/calendar/get", {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token,
            },
        });
        const data = await res.json();
        return data
    }
    async function getCalendyxEvents() {
        const res = await fetch("http://localhost:3000/api/event/get", {
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

    //Constructeur calendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        headerToolbar: {
            left: 'prev next',
            center: 'title today',
            right: "dayGridWeek,dayGridMonth"
        },
        buttonText: {
            today: "Aujourd'hui"
        },
        firstDay: 1,
        editable: false,
        eventOrder: "order",
        eventClick: (info) => {
            info.jsEvent.preventDefault()
            createModale(info)
        }
    });



    // ====== Rempli le canlendar avec la data
    const eventDataGoogle = await getGoogleCalendar()
    const eventCalendyx = await getCalendyxEvents()

    let turn = 0;
    //calendyx
    eventCalendyx.event.data.map((element) => {
        calendar.addEvent({
            allDay: true,
            start: element.dateDebut,
            end: element.dateFin,

            title: element.titleEvent,

            extendedProps: {
                data: element,
                description: element.messageEvent
            },

            className: "css class",

            color: "white",
            borderColor: "pink",
            backgroundColor: "grey",
            textColor: "white",

            editable: false,
            order: turn,
        })
        turn++
    })

    //google
    eventDataGoogle.events.data.items.map((element) => {
        calendar.addEvent({
            allDay: true,
            start: element.start.dateTime,
            end: element.end.dateTime,

            title: element.summary,
            extendedProps: {
                data: element,
            },

            className: "css class",

            color: "white",
            borderColor: "pink",
            backgroundColor: "grey",
            textColor: "white",

            editable: false,
            order: turn,
        })
        turn++
    })

    calendar.render();

})

