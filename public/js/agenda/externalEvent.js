function resetDomExternal() {
    $("#external-title").val("")
    $("#external-description").val("")
    $("#external-img-choice").css("display", "none")
    $("#external-klendyx").prop("checked", false)
    $("#external-google").prop("checked", false)
    $("#external-apple").prop("checked", false)
    $("#external-horaire-start").val("12:00")
    $("#external-horaire-end").val("13:00")
}

function setHtmlExternalFav(data) {
    const { title, description, hourStart, hourEnd, calendarSave, imgSrc, imgAlt, imgHtml } = data

    return `<div class="external-element-fav">
        <div class="fc-event" data-title="${title}" data-describe="${description}"
            data-start="${hourStart}"
            data-end="${hourEnd}"
            data-calendarSave='${JSON.stringify(calendarSave)}'
            data-image='${JSON.stringify({ src: imgSrc, alt: imgAlt })}'>

                <svg class="grip-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                        <circle cx="9" cy="12" r="1"></circle>
                        <circle cx="9" cy="5" r="1"></circle>
                        <circle cx="9" cy="19" r="1"></circle>
                        <circle cx="15" cy="12" r="1"></circle>
                        <circle cx="15" cy="5" r="1"></circle>
                        <circle cx="15" cy="19" r="1"></circle>
                    </svg>
                        ${imgHtml}
                        <span class="external-title">${title}</span>
                        </div>
                        <span class="external-event-delete" title="supprimer des favoris">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                        </span>
                    </div></div>`
}

function addExternalFavLocalStorage(data) {
    const storage = JSON.parse(localStorage.getItem("external-favoris")) || [];
    storage.push(data);
    localStorage.setItem("external-favoris", JSON.stringify(storage));
}

function setExternalFavLocalStorage() {
    const data = JSON.parse(window.localStorage.getItem("external-favoris")) || []
    data.forEach(fav => {
        const html = setHtmlExternalFav(fav)
        $(".frame-external-fc").append(html)
    })
}

function deleteExternalFavLocalStorage(data) {
    const storage = JSON.parse(window.localStorage.getItem("external-favoris"))
    let index = 0;
    for (let i = 0; i < storage.length; i++) {
        if (storage[i].title == data.title
            && storage[i].hoursStart == data.start
            && storage[i].hoursEnd == data.end) index = i
    }
    storage.splice(index, 1)
    window.localStorage.setItem("external-favoris", JSON.stringify(storage))
}

//Toute les images pour les icones 
const img = {
    none: `<p style="height: 38px; width:38px;margin:0" id="none"></p>`,
    voiture: `<img width="38" height="38" src="https://img.icons8.com/color/48/hatchback.png" alt="hatchback"/>`,
    teletravail: `<img width="38" height="38" src="https://img.icons8.com/color/48/working-with-a-laptop.png" alt="working-with-a-laptop"/>`,
    reunion: `<img width="38" height="38" src="https://img.icons8.com/external-xnimrodx-lineal-color-xnimrodx/64/external-meeting-time-management-xnimrodx-lineal-color-xnimrodx.png" alt="external-meeting-time-management-xnimrodx-lineal-color-xnimrodx" />`,
    sport: `<img width="38" height="38" src="https://img.icons8.com/color/48/dumbbell.png" alt="sport"/>`,
    courir: `<img width="38" height="38" src="https://img.icons8.com/color/48/running.png" alt="running"/>`,
    yoga: `<img width="38" height="38" src="https://img.icons8.com/color/48/yoga.png" alt="yoga"/>`,
    metro: `<img width="38" height="38" src="https://img.icons8.com/color/48/train.png" alt="train"/>`,
    bus: `<img width="38" height="38" src="https://img.icons8.com/color/48/bus.png" alt="bus"/>`,
    appel_client: `<img width="38" height="38" src="https://img.icons8.com/doodle/48/apple-phone.png" alt="phone"/>`,
    reunion: `<img width="38" height="38" src="https://img.icons8.com/color/48/conference.png" alt="conference"/>`,
    visio: `<img width="38" height="38" src="https://img.icons8.com/color/48/video-call.png" alt="video-call"/>`,
    brainstorming: `<img width="38" height="38" src="https://img.icons8.com/color/48/idea.png" alt="idea"/>`,
    planning: `<img width="38" height="38" src="https://img.icons8.com/color/48/planner.png" alt="planner"/>`,
    email: `<img width="38" height="38" src="https://img.icons8.com/lollipop/48/new-post.png" alt="new-post"/>`,
    pause_cafe: `<img width="38" height="38" src="https://img.icons8.com/color/48/coffee-to-go.png" alt="coffee-to-go"/>`,
    dej: `<img width="38" height="38" src="https://img.icons8.com/color/48/meal.png" alt="meal"/>`,
    courses: `<img width="38'" height="38" src="https://img.icons8.com/skeuomorphism/32/fast-cart.png" alt="fast-cart"/>`,
    cuisine: `<img width="38" height="38" src="https://img.icons8.com/color/48/fry.png" alt="fry"/>`,
    menage: `<img width="38" height="38" src="https://img.icons8.com/color/48/cleaning-a-surface.png" alt="cleaning"/>`,
    lecture: `<img width="38" height="38" src="https://img.icons8.com/color/48/open-book.png" alt="open-book"/>`,
    gaming: `<img width="38" height="38" src="https://img.icons8.com/color/48/controller.png" alt="controller"/>`,
    rdv_medical: `<img width="38" height="38" src="https://img.icons8.com/color/48/medical-doctor.png" alt="medical-doctor"/>`,
    dev: `<img width="38" height="38" src="https://img.icons8.com/color/48/source-code.png" alt="source-code"/>`,
    data: `<img width="38" height="38" src="https://img.icons8.com/color/48/combo-chart.png" alt="combo-chart"/>`,
    promenade: `<img width="38" height="38" src="https://img.icons8.com/color/48/walking.png" alt="walking"/>`,
    chien: `<img width="38" height="38" src="https://img.icons8.com/color/48/dog.png" alt="dog"/>`,
    budget: `<img width="38" height="38" src="https://img.icons8.com/color/48/budget.png" alt="budget"/>`,
    backup: `<img width="38" height="38" src="https://img.icons8.com/color/48/cloud-backup-restore.png" alt="cloud-backup"/>`,
    creation_contenu: `<img width="38" height="38" src="https://img.icons8.com/color/48/edit.png" alt="edit"/>`,
    notifications: `<img width="38" height="38" src="https://img.icons8.com/color/48/appointment-reminders.png" alt="reminders"/>`
};




$(function () {

    const containerEl = document.getElementById("external-events")
    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        handle: '.fc-event-handle'
    });


    //charge les external save en localStorage
    setExternalFavLocalStorage()

    //Ouvre le container des img pour external
    let iconeFrameExtended = false;
    const container = $("#icons-container")
    $("#external-add-img").on("click", function (e) {
        e.preventDefault();

        if (!iconeFrameExtended && container.children().length === 0) {
            Object.entries(img).forEach(([key, html]) => {
                const card = document.createElement("div")
                card.className = "icon-card"
                card.innerHTML = html
                card.id = key
                $(container).append(card)
            });
        }
        iconeFrameExtended = !iconeFrameExtended;
        container.css("display", iconeFrameExtended ? "flex" : "none");
    });


    //click sur une image dans le container
    $(document).on('click', ".icon-card", function (e) {
        $(container).css("display", "none")
        iconeFrameExtended = false
        if (e.target.id == "none") {
            $("#external-img-choice").prop("src", "").css("display", "none")
            return
        }
        $("#external-img-choice").prop("src", e.target.src).css("display", "block")
    })


    //submit le new external
    $("#submit-add-new-external").on("click", function (e) {
        e.preventDefault()
        const title = escapeHtml($("#external-title").val())

        const imgSrc = $("#external-img-choice").attr("src")
        const imgAlt = $("#external-img-choice").attr("alt")
        const imgHtml = imgSrc ? `<img width="38" height="38" src="${imgSrc}" alt="${imgAlt}" />` : `${img["none"]}`
        const description = $("#external-description").val();
        const hourStart = $("#external-horaire-start").val()
        const hourEnd = $("#external-horaire-end").val()
        const klendyx = $("#external-klendyx").is(":checked")
        const google = $("#external-google").is(":checked")
        const apple = $("#external-apple").is(":checked")
        const outlook = $("#external-outlook").is(":checked")
        const calendarSave = { klendyx, google, apple, outlook }
        const html = setHtmlExternalFav({ title, description, hourStart, hourEnd, calendarSave, imgSrc, imgAlt, imgHtml })
        if (!title.length) {
            return createClassiqueModale("Veuillez saisir un titre.")
        }
        if (hourStart.split(":")[0] > hourEnd.split(":")[0]) {
            return createClassiqueModale("Erreur dans l'horaire, le début ne pas pas être après la fin.")
        }

        const ctrlOneCalendarSave = [klendyx, google, apple, outlook].reduce((accu, current) => current == true ? accu += 1 : accu += 0, 0)

        if (!ctrlOneCalendarSave) {
            return createClassiqueModale("Veuillez saisir au moins un agenda dans lequel sauvegarder votre événement.")
        }
        addExternalFavLocalStorage({ title, description, hourStart, hourEnd, calendarSave, imgSrc, imgAlt, imgHtml })

        $(".frame-external-fc").append(html)

        resetDomExternal()
    })



    //supprimer raccourci dragable du dom et localStorage
    $(document).on("click", ".external-event-delete", function () {
        const el = $(this).closest(".external-element-fav");
        if (!el.length) return

        const fcEvent = el.find(".fc-event").first()
        if (!fcEvent.length) {
            console.warn("Aucun fc-event trouvé pour cet external-element-fav");
            return;
        }

        const title = fcEvent.data("title")
        const start = fcEvent.data("start");
        const end = fcEvent.data("end");

        if (!title || !start || !end) {
            console.warn("Certains data-attributes sont manquants:", { title, start, end });
            return;
        }

        deleteExternalFavLocalStorage({ title, start, end });
        el.remove();
    });
})