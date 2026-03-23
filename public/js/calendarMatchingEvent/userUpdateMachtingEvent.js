const parseStrDateToHours = date => date.split(" ")[0].replace(":", "h").slice(0, 5)
const parseDateToFrench = day => day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const firstToUpper = str => str.toUpperCase().slice(0, 1) + str.slice(1)


// =====================
// Helpers
// =====================

/**
 * Parse une date "YYYY-MM-DD ..." en heure locale (évite le décalage UTC).
 */
function parseLocalDate(isoStr) {
    const datePart = isoStr.split(" ")[0];
    const [y, m, d] = datePart.split("-").map(Number);
    return new Date(y, m - 1, d);
}

/**
 * Convertit une Date en string "YYYY-MM-DD" sans décalage UTC.
 */
function toLocalISOString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Réinitialise visuellement un label (efface background ET background-color).
 */
function resetLabelStyle(selector) {
    $(selector).css({ "background": "white", "background-color": "white" });
}

/**
 * Applique le style actif (gradient bleu) sur un label.
 */
function setLabelActive(selector) {
    $(selector).css("background", "linear-gradient(135deg, #007bff 0%, #0056b3 100%)");
}

/**
 * Génère un id unique pour chaque event FC via un compteur incrémental.
 */
let _eventIdCounter = 0;
function generateEventId() {
    return `event-${++_eventIdCounter}`;
}


// =====================
// API
// =====================


async function getDataEvent(urlToken, host) {
    const res = await fetch(`${host}/api/matching-event/get?token=${urlToken}`, {
        method: "GET",
    });
    const dataMatchingEvent = await res.json();

    if (!dataMatchingEvent.success) {
        createClassiqueModale("Cet évènement n'est pas valide, vous allez être redirigé vers la page d'accueil");
        $("#btn-confirm-classique-modale").remove();
        setTimeout(() => window.location.href = `${host}/index`, 2500);
    }

    return dataMatchingEvent;
}





async function updateJsonUndisponibility(host, undisponibility, urlToken) {
    const res = await fetch(`${host}/api/matching-event/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ undisponibility, token: urlToken })
    });
    return await res.json();
}




/**
 * Setup du calendrier FullCalendar, prends date start et end pour faire la range du calendrier
 * @param {Date} dayStart 
 * @param {Date} dayEnd 
 * @returns 
 */
function setFcCalendar(dayStart, dayEnd) {
    const calendarEl = document.getElementById('calendar');
    const sameMonth = parseLocalDate(dayStart).getMonth() === parseLocalDate(dayEnd).getMonth();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayMaxEvents: 3,
        locale: 'fr',
        contentHeight: "auto",
        firstDay: 1,
        editable: true,
        eventOrder: "order",
        headerToolbar: {
            left: sameMonth ? "" : "prev next",
            center: 'title',
            right: sameMonth ? "" : "dayGridWeek,dayGridMonth"
        },
        validRange: {
            start: dayStart,
            end: dayEnd
        },
        eventClick: (info) => {
            const title = info.event.title;
            if (title === "Indisponible" || title === "Disponible" || title === "Preference") {
                createModaleEvent(info);
            }
        }
    });

    calendar.render();
    return calendar;
}

function setEventDragable(color) {
    const containerEl = document.getElementById("external-events");
    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
            if (eventEl.innerText === "Disponible") {
                return {
                    title: "Disponible",
                    display: "background",
                    color: color.bgDispo,
                    borderColor: "#008000",
                };
            }
            if (eventEl.innerText === "Date de préférence") {
                return {
                    title: "Preference",
                    display: "background",
                    color: color.bgDispoPref,
                    borderColor: "#004687",
                };
            }
            if (eventEl.innerText === "Indisponible") {
                return {
                    title: "Indisponible",
                    display: "background",
                    color: color.bgIndispo,
                    borderColor: "#800000",
                };
            }
        }
    });
}


// =====================
// Modales
// =====================

function createModaleEvent(info) {
    const strDate = firstToUpper(parseDateToFrench(new Date(info.event.start)));
    const start = parseStrDateToHours(new Date(info.event.start).toTimeString());
    const end = parseStrDateToHours(new Date(info.event.end).toTimeString());

    const dateStyle = `width:fit-content; position:relative; right:-25%; text-align:center;
        font-size:22px; margin-bottom:40px; border-bottom:1px solid #DCDCDC`;

    const style = {
        Indisponible: "background-color: #F08080",
        Disponible: "background-color: #ADFF2F",
        Preference: "background-color: #00BFFF"
    };

    const period = info.event.allDay ? "Toute la journée" : `De ${start} à ${end}`;
    const html = `<div>
        <p style="${dateStyle}"><strong>${strDate}</strong></p>
        <p>Status : <span style="${style[info.event.title]}; padding:4px 7px; font-weight:500; border-radius:15px; margin-bottom:10px">${info.event.title}</span></p>
        <p>Période : ${period}</p>
    </div>`;

    createClassiqueModale(html);

    // FIX : id unique stocké en data-event-id, pas dans l'attribut id du bouton
    $(".classique-modale-footer").append(
        `<button class='btn btn-delete' data-event-id='${info.event.id}'>Supprimer</button>`
    );
}










/**
 * Ajoute ou supprime des events "Indisponible" (journée entière) pour chaque
 * occurrence de dayNumber dans [dayStart, dayEnd].
 * Chaque event reçoit un id unique — les ids sont mémorisés dans un registry
 * pour pouvoir tous les supprimer proprement au décoché.
 */
function addDaysEventIndispo(dayNumber, state, dayStart, dayEnd, color, calendar) {
    if (!addDaysEventIndispo._registry) addDaysEventIndispo._registry = {};

    if (state) {
        const date = parseLocalDate(dayStart);
        const dateEnd = parseLocalDate(dayEnd);
        const ids = [];

        while (date <= dateEnd) {
            if (date.getDay() === dayNumber) {
                const id = generateEventId();
                ids.push(id);
                calendar.addEvent({
                    id,
                    title: "Indisponible",
                    start: toLocalISOString(date),
                    display: "background",
                    color: color.bgIndispo,
                });
            }
            date.setDate(date.getDate() + 1);
        }

        addDaysEventIndispo._registry[dayNumber] = ids;
    } else {
        const ids = addDaysEventIndispo._registry[dayNumber] || [];
        ids.forEach(id => {
            const event = calendar.getEventById(id);
            if (event) event.remove();
        });
        delete addDaysEventIndispo._registry[dayNumber];
    }
}

/**
 * Ajoute des events sur une plage horaire pour les jours sélectionnés.
 * Chaque event reçoit un id unique pour permettre une suppression individuelle.
 */
function addDaysEventDispohoraire(dayNumbers, setup, hourStart, hourEnd, dayStart, dayEnd, color, calendar) {
    const date = parseLocalDate(dayStart);
    const dateEnd = parseLocalDate(dayEnd);

    const parametre = {
        disponible: { title: "Disponible", color: color.bgDispo },
        indisponible: { title: "Indisponible", color: color.bgIndispo },
        preference: { title: "Preference", color: color.bgDispoPref }
    };

    while (date <= dateEnd) {
        if (dayNumbers.includes(date.getDay())) {
            const day = toLocalISOString(date);
            calendar.addEvent({
                id: generateEventId(),
                title: parametre[setup].title,
                start: `${day}T${hourStart}:00`,
                end: `${day}T${hourEnd}:00`,
                color: parametre[setup].color,
            });
        }
        date.setDate(date.getDate() + 1);
    }
}

/**
 * Hydrate le JSON d'undisponibilité avec tous les events du calendrier.
 */
function hydraterJsonUndisponibility(json, calendar, origin) {
    calendar.getEvents().forEach((e) => {
        const title = e._def.title;
        let start = e.start;
        let end = e.end;
        const allDay = e.allDay;

        if (allDay) {
            start = start.toLocaleDateString('fr-CA');
            end = null;
        }

        switch (title) {
            case "Disponible":
                json[origin].disponible.push({ start, end, allDay });
                break;
            case "Indisponible":
                json[origin].indisponible.push({ start, end, allDay });
                break;
            case "Preference":
                json[origin].preference.push({ start, end, allDay });
                break;
            default:
                json[origin].indisponible.push({ start: e.startStr, end: e.endStr, allDay });
        }
    });
    json[origin].validate = true;
    return json;
}


//MAIN
$(async () => {

    const url = window.location.href;
    const urlToken = url.split("/")[4];
    const origin = url.split("/")[5];

    const config = await getConfig();
    const host = config.host;

    const dataMatchingEvent = await getDataEvent(urlToken, host);

    if(dataMatchingEvent.event.data.undisponibility[origin].validate === true){
        console.log("matching déjà repondu")
        console.log("")
        $(".frame-calendar").remove()
        MessageAlert.create("error","#message-alert", "Vous avez déjà répondu à ce matching de rendez-vous. Merci de patienter le temps que tout ce matching soit résolu. Vous recevrez une notification par email lorseque celui-ci sera résolu.")
    }
    const dayStart = dataMatchingEvent.event.data.rangeStart;
    const dayEnd = dataMatchingEvent.event.data.rangeEnd;

    const color = {
        bgDispo: "#ADFF2F",
        bgIndispo: "#F08080",
        bgDispoPref: "#00BFFF",
    };

    const calendar = setFcCalendar(dayStart, dayEnd);
    setEventDragable(color);

    const days = [
        { id: "lundi", numberDay: 1 },
        { id: "mardi", numberDay: 2 },
        { id: "mercredi", numberDay: 3 },
        { id: "jeudi", numberDay: 4 },
        { id: "vendredi", numberDay: 5 },
        { id: "samedi", numberDay: 6 },
        { id: "dimanche", numberDay: 0 }
    ];


    // --- Indisponibilités par jour entier ---
    days.forEach(day => {
        $(`#${day.id}`).on("click", () => {
            const state = $(`#${day.id}`).is(":checked");
            if (state) {
                $(`#label-${day.id}`).css({ "background": "#FFB2B2", "background-color": "#FFB2B2" });
            } else {
                resetLabelStyle(`#label-${day.id}`);
            }
            addDaysEventIndispo(day.numberDay, state, dayStart, dayEnd, color, calendar);
        });
    });


    // --- Plages horaires : couleur label ---
    days.forEach(day => {
        $(`#horaire-${day.id}`).on("click", () => {
            const state = $(`#horaire-${day.id}`).is(":checked");
            if (state) {
                setLabelActive(`#label-horaire-${day.id}`);
            } else {
                resetLabelStyle(`#label-horaire-${day.id}`);
            }
        });
    });


    // --- Ajout plage horaire au calendrier ---
    $("#btn-submit-horaire").on("click", (e) => {
        e.preventDefault();

        const arrayDays = days
            .filter(day => $(`#horaire-${day.id}`).is(":checked"))
            .map(day => day.numberDay);

        const setupDisponible = $("#plage-horaire-setup-disponible").is(":checked");
        const setupIndisponible = $("#plage-horaire-setup-indisponible").is(":checked");
        const setupPreference = $("#plage-horaire-setup-preference").is(":checked");

        const horaireStart = $("#horaire-time-start").val();
        const horaireEnd = $("#horaire-time-end").val();

        if (setupDisponible) addDaysEventDispohoraire(arrayDays, "disponible", horaireStart, horaireEnd, dayStart, dayEnd, color, calendar);
        if (setupIndisponible) addDaysEventDispohoraire(arrayDays, "indisponible", horaireStart, horaireEnd, dayStart, dayEnd, color, calendar);
        if (setupPreference) addDaysEventDispohoraire(arrayDays, "preference", horaireStart, horaireEnd, dayStart, dayEnd, color, calendar);

        days.forEach((day) => {
            $(`#horaire-${day.id}`).prop("checked", false);
            resetLabelStyle(`#label-horaire-${day.id}`);
        });
    });


    //Supprimer un event depuis la modale 
    $(document).on("click", ".btn-delete", () => {
        const el = $(".btn-delete")[0];
        const id = $(el).data("event-id");
        const event = calendar.getEventById(id);
        if (event) event.remove();
        $("#btn-close-classique-modale").click();
    });


    // --- Validation finale ---
    $("#btn-submit-matching").on("click", async () => {
        const json = dataMatchingEvent.event.data.undisponibility;

        const jsonUpdated = hydraterJsonUndisponibility(json, calendar, origin);

        const updated = await updateJsonUndisponibility(host, jsonUpdated, urlToken);
        if (updated.success) {
            MessageAlert.create("success","#message-alert", "Merci pour votre réponse, vos disponibilitées on bien été prise en compte. Vous recevrez un message de notification par email lorsequ'une date définitive aura été établie.")
            MessageAlert.removeMessage("12000")
        }
    });

});