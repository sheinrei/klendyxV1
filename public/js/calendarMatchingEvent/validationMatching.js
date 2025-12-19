
async function getEventGoogle(host, rangeStart, rangeEnd, idUser) {
    const rangeEndInclude = new Date(rangeEnd);
    rangeEndInclude.setUTCDate(rangeEndInclude.getUTCDate() + 1);
    rangeEndInclude.setUTCHours(0, 0, 0, 0);

    const rangeEndMax = rangeEndInclude.toISOString()

    const resEventGoogle = await fetch(`${host}/api/calendar/google/get/invite?rangeMin=${rangeStart}&rangeMax=${rangeEndMax}&userId=${idUser}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const dataEventGoogle = await resEventGoogle.json()
    return dataEventGoogle
}

function setHtmlModaleClickEvent(info) {
    const data = info.event
    const date = parseDateToFrench(new Date(data.start))
    const start = data.startStr.split("T")[1].replace(":", "h").slice(0, 5);
    const end = data.endStr.split("T")[1].replace(":", "h").slice(0, 5)
    const title = data.title
    const description = data._def.extendedProps.data.description || "Pas de description"


    return `<div>
                <p style="width:fit-content;position:relative;left:50%; transform : translateX(-50%); font-size:20px; margin-bottom:25px"><strong> ${firstToUpper(date)} </strong></p>
                <p>Titre : ${title}</p>
                <p>horaire : De ${start} à ${end}</p>
                <p>Description : ${description} </p>
            </div>`
}

function setCalendar(start, end) {

    let fcRight = "";
    let fcLeft = ""
    const sameMonth = new Date(start).getMonth() === new Date(end).getMonth()

    if (!sameMonth) {
        fcRight += "dayGridWeek,dayGridMonth"
        fcLeft = "prev next"
    }

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dayMaxEvents: 3,
        locale: 'fr',
        contentHeight: "auto",
        headerToolbar: {
            left: fcLeft,
            center: 'title',
            right: fcRight
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
            start: start,
            end: end
        },
        eventClick: function (info) {
            console.log(info);
            const html = setHtmlModaleClickEvent(info)
            createClassiqueModale(html)
        }
    });
    calendar.render()
    return calendar
}

function addEventToFC(event, calendar) {
    let turn = 0;
    event.map((element) => {
        calendar.addEvent({
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

function addDomDateResolv(date) {
    date.sort((a, b) => b.dayScore - a.dayScore)

    //Gestion si aucune date n'est disponible
    if (date.every(day => day.slots.length === 0)) {
        const bestDay = parseDateToFrench(new Date(date[0].date))
        return `
            <section class="cards-date">
                <p>Aucun créneau disponible pour ce matching.<br>
                Le jour le plus proche est : <strong>${firstToUpper(bestDay)}</strong><br>
                Vous pouvez relancer un matching en cliquant <span class="span-redirect">ici</span></p>
            </section>
        `;
    }


    let htmlChoice = "";
    let countId = 0
    for (let i = 0; i < 3; i++) {
        if (!date[i].slots.length) {
            countId++
            return
        }
        const htmlSectionStart = `<section class='cards-date'>
                    <div style="margin:auto">
                       ${firstToUpper(parseDateToFrench(new Date(date[i].date)))}
                       </div>
                       `
        let htmlSectionBody = ""
        const htmlSectionEnd = "</section>"

        date[i].slots.forEach(slot => {
            switch (slot.period) {
                case "matin":
                    const startUTC_AM = new Date(slot.start).toLocaleString()
                    const endUTC_AM = new Date(slot.end).toLocaleString()
                    const hourStartAM = parseStrDateToHours(startUTC_AM)
                    const hourEndAM = parseStrDateToHours(endUTC_AM)
                    const buttonAM = ` <button class="btn-submit" id="btn-submit-AM-${countId}">Selectionner</button>`;
                    const stringMorning = "De " + hourStartAM + " à " + hourEndAM

                    htmlSectionBody += `<div class="cards-hours-event">Matin : ${stringMorning}${buttonAM}</div>`
                    break;
                case "après-midi":
                    const startUTC_PM = new Date(slot.start).toLocaleString()
                    const endUTC_PM = new Date(slot.end).toLocaleString()
                    const hourStartPM = parseStrDateToHours(startUTC_PM)
                    const hourEndPM = parseStrDateToHours(endUTC_PM)
                    const stringAfternoon = "De " + hourStartPM + " à " + hourEndPM
                    const buttonPM = `<button class="btn-submit" id="btn-submit-PM-${countId}">Selectionner</button>`;

                    htmlSectionBody += `<div class="cards-hours-event">Après-midi : ${stringAfternoon}${buttonPM}</div>`
                    break
            }
        })

        htmlChoice += htmlSectionStart + htmlSectionBody + htmlSectionEnd
        countId++
    }

    return htmlChoice
}

function addDomEventData() {
    const html = `
        <div class="card-wrapper">
           <div id="frame-left">
                <div class="card-content">


                    <div class="header">
                        <h2 class="title">Résumé du matching</h2>
                        <span class="badge">Validation</span>
                    </div>


                    <div class="info-grid">
                        <!-- Date de création -->
                        <div class="info-box info-box-date">
                        <div class="info-label">📅 Créé le</div>
                        <div class="info-value" id="created-at"></div>
                        </div>


                    <!-- Titre de l'événement -->
                    <div class="info-box info-box-title">
                        <div class="info-label">📝 Titre</div>
                        <div class="info-value info-value-large" id="event-title"></div>
                    </div>


                        <!-- Description -->
                    <div class="info-box info-box-description">
                        <div class="info-label">💬 Description</div>
                        <div class="info-value info-value-text" id="description"></div>
                    </div>
    

                      <!-- Durée et horaires (2 colonnes) -->
                    <div class="info-row">
                        <div class="info-box info-box-duration">
                        <div class="info-label">⏱ Durée</div>
                        <div class="info-value info-value-highlight" id="duration"></div>
                    </div>

                    <div class="info-box info-box-hours">
                        <div class="info-label">🕒 Plage horaire</div>
                        <div class="info-value info-value-highlight" id="hours-range"></div>
                    </div>
                    </div>

                     <!-- Invités -->
                    <div class="info-box info-box-contact">
                        <div class="info-label">👥 Invités</div>
                        <div class="info-value" id="contact"></div>
                    </div>

                      <!-- Adresse -->
                    <div class="info-box info-box-address">
                        <div class="info-label">📍 Adresse</div>
                        <div class="info-value" id="event-address"></div>
                    </div>
                </div>
            </div>

            
            </div>
            <div id="frame-right"></div>
        </div>
`;
    return html
}

function setDomAfterSubmit(dateString, hourStartString, hourEndString, calendar, date, start, end, title) {


    //Mettre un texte qui de confirmation a l'event
    scrollTo(0, 0)
    const htmlMessageAlert = `<p style="background:white ; color:green; padding: 8px 20px; font-size:18px">
        L’événement a été enregistré avec succès. Tous les participants ont reçu une notification par email.
    </p>`
    $("#message-alert").append(htmlMessageAlert)

    //Supprimer les cards de date
    $(".cards-date").remove()

    //Ajouter une cards avec la validation de l'event et la data
    const htmlCard = `
                <div class="cards-date" style="width:100%; padding: 16px; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                        📅 ${dateString}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666; display: flex; align-items: center; gap: 6px;">
                        <span style="display: inline-block;">🕐</span>
                        <span>De ${hourStartString} à ${hourEndString}</span>
                    </p>
                </div>
            `;

    $("#frame-right").append(htmlCard)

    //span .badge passer le texte a Confirmé
    $(".badge").text("CONFIRMÉ").css({ background: "linear-gradient(90deg,rgba(75, 222, 102, 1) 0%, rgba(108, 217, 130, 1) 26%, rgba(157, 214, 122, 1) 77%, rgba(163, 217, 54, 1) 100%)" })

    //ajouter le nouvelle events validé au FC
    calendar.addEvent({
        start,
        end,
        title,
        color: "white",
        textColor: "white",
        editable: false,
        className: ["event-added"]
    })
    calendar.render()

    //retirer les colors des dates qui étaient proposées 
    colorFCCalendar(date, "white")

}

function hydrateDomTextDataEvent(data) {
    const { eventTitle, description, durationEvent, createdAt, contact, eventAddress, rangeHoursStart, rangeHoursEnd } = data.event.data
    document.getElementById('created-at').textContent = firstToUpper(parseDateToFrench(new Date(createdAt)))
    document.getElementById('event-title').textContent = eventTitle;
    document.getElementById('description').textContent = description;
    document.getElementById('duration').textContent = durationEvent + "h";
    document.getElementById('hours-range').textContent = `${rangeHoursStart}h - ${rangeHoursEnd}h`;
    document.getElementById('contact').textContent = contact.join("\n");
    document.getElementById('event-address').textContent = eventAddress;
}

function colorFCCalendar(date, color) {
    date.sort((a, b) => b.dayScore - a.dayScore)
    for (let i = 0; i < 3; i++) {
        if (date[i].slots.length == 0) return
        const cell = document.querySelector(`[data-date='${date[i].date}']`);
        cell.style.backgroundColor = color;
    }
}


const parseStrDateToHours = date => date.split(" ")[1].replace(":", "h").slice(0, 5)

const parseDateToFrench = day => day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

const firstToUpper = str => str.toUpperCase().slice(0, 1) + str.slice(1)





//Flux principal
$(async function () {
    const config = await getConfig()
    const host = config.host

    const url = window.location.href
    const token = url.split("=")[1]

    const res = await fetch(`${host}/api/event/matching-event/get?token=${token}`, {
        method: "GET",
        "Content-Type": "application/json"
    })
    const data = await res.json()
    if (!data.success) {
        createClassiqueModale("Cet évènement n'est pas valide, vous allez être redirigé vers la page d'accueil")
        $("#btn-confirm-classique-modale").remove()
        setTimeout(
            () => window.location.href = `${host}/index`, 2500
        )
    }

    let date = data.event.data.resolve

    //créé la frame des data event
    const htmlEventData = addDomEventData()
    $("#data-event-matching").append(htmlEventData)
    hydrateDomTextDataEvent(data)

    const htmlDateChoice = addDomDateResolv(date)
    $("#frame-right").append(htmlDateChoice)

    //Ajout du calendar
    const rangeStart = data.event.data.rangeStart
    const rangeEnd = data.event.data.rangeEnd
    const calendar = setCalendar(rangeStart, rangeEnd)


    //chercher les infos des events google
    const idUser = data.event.data.idUser;
    const dataEventGoogle = await getEventGoogle(host, rangeStart, rangeEnd, idUser)


    //hydrater le FC
    if (dataEventGoogle.success) {
        const eventsGoogle = dataEventGoogle.events.data.items
        addEventToFC(eventsGoogle, calendar)
    }

    //Affiche le calendrier si il y a des events
    const allEvent = calendar.getEvents()
    if (allEvent.length) {
        calendar.render()
        colorFCCalendar(date, "#89CFF0")
    } else {
        $("#calendar").remove()
    }


    //EVENT 
    //btn open modale du choix de la date
    $(".btn-submit").on("click", function (e) {
        e.preventDefault();
        const id = $(this).prop("id")
        const data = date[id.split("-")[3]]
        let period = id.split("-")[2]

        //chercher le bon slots
        period === "AM" ? period = "matin" : period = "après-midi";
        const greatHoraire = data.slots[0].period == period ? 0 : 1

        const horaireSelected = data.slots[greatHoraire];
        const { start, end } = horaireSelected;
        const dateStart = new Date(start);
        const dateEnd = new Date(end);
        const stringDateStart = dateStart.toLocaleString("fr-FR")
        const stringDateEnd = dateEnd.toLocaleString("fr-FR")

        let addGoogle = ""
        if (dataEventGoogle.success) {
            addGoogle = `<div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
                            <label for="add-event-google" style="cursor:pointer;">
                                Ajouter à mon agenda Google
                            </label>
                            <input type="checkbox" id="add-event-google" checked
                                style="appearance:none;width:36px;height:18px;background:#ccc;border-radius:9px;position:relative;cursor:pointer;outline:none;transition:.3s;">
                        </div>`
        }

        const html = `<div style="padding: 20px;">
                        <input type="hidden" id="event-date-start" value="${start}">
                        <input type="hidden" id="event-date-start-string" value="${parseStrDateToHours(stringDateStart)}">
                        <input type="hidden" id="event-date-end" value="${end}">
                        <input type="hidden" id="event-date-end-string" value="${parseStrDateToHours(stringDateEnd)}">
                        <input type="hidden" id="event-date-string" value="${firstToUpper(parseDateToFrench(dateStart))}">

                        <div style="background: #f8f9fa; border-left: 4px solid #7c3aed; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
                            <p style="margin: 0 0 8px 0; font-size: 15px; color: #333;">
                                📅 <strong>${firstToUpper(parseDateToFrench(dateStart))}</strong>
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                🕐 De ${parseStrDateToHours(stringDateStart)} à ${parseStrDateToHours(stringDateEnd)}
                            </p>
                        </div>

                        <p style="margin: 0 0 12px 0; font-size: 15px; color: #2c2c2cff; line-height: 1.5;">
                            Si cet horaire vous convient, vous pouvez confirmer.
                        </p>
                        
                        <p style="margin: 0 0 16px 0; font-size: 15px; color: #777; line-height: 1.5;">
                            ℹ️ Les participants recevront une notification par email de la confirmation du rendez-vous.
                        </p>
                        ${addGoogle}
                    </div>`

        createClassiqueModale(html)
        $(".classique-modale-footer").append("<button class='btn-primary' id='btn-submit-matching'>Confirmer</button>")

    })

    //btn Valide le choix de la date
    $(document).on("click", "#btn-submit-matching", async function (e) {
        e.preventDefault()

        const start = $("#event-date-start").val()
        const end = $("#event-date-end").val()
        const addGoogle = $("#add-event-google").is(":checked")
        const dateEventString = $("#event-date-string").val();
        const hoursStartString = $("#event-date-start-string").val()
        const hoursEndString = $("#event-date-end-string").val();
        const titleEvent = $("#event-title").text()

        $("#btn-confirm-classique-modale").click()

        const res = await fetch(`${host}/api/event/matching-event/final`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dateStart: start,
                dateEnd: end,
                token: token,
                addGoogle,
                titleEvent,
                dateEventString,
                hoursStartString,
                hoursEndString
            })
        })
        setDomAfterSubmit(dateEventString, hoursStartString, hoursEndString, calendar, date, start, end, titleEvent)
    })

    //Redirection vers la page d'agenda si on veut relancer un matching
    $(".span-redirect").on("click", function (e) {
        e.preventDefault();
        window.localStorage.setItem("redirect", `${host}/agenda`)
        window.location.href = `${host}/agenda`
    })
})