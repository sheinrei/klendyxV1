
const parseStrDateToHours = date =>
    date.split(" ")[1].replace(":", "h").slice(0, 5);

const parseDateToFrench = day =>
    day.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });



//Hydratation des données dans le dom pour le recap du matching
function hydrateDomTextDataEvent(data) {
    const {
        eventTitle, description, durationEvent,
        createdAt, contact, eventAddress,
        rangeHoursStart, rangeHoursEnd
    } = data.event.data;

    document.getElementById('created-at').textContent =
        firstToUpper(parseDateToFrench(new Date(createdAt)));
    document.getElementById('event-title').textContent = eventTitle;
    document.getElementById('description').textContent = description;
    document.getElementById('duration').textContent = durationEvent + "h";
    document.getElementById('hours-range').textContent =
        `${rangeHoursStart}h - ${rangeHoursEnd}h`;
    document.getElementById('contact').textContent = contact.join("\n");
    document.getElementById('event-address').textContent = eventAddress;
}



//Hydratation des resultats du matching
function hydrateDateCards(dates) {
    dates.sort((a, b) => b.dayScore - a.dayScore);

    // Cas : aucun créneau disponible sur tous les jours
    if (dates.every(day => day.slots.length === 0)) {
        const bestDay = parseDateToFrench(new Date(dates[0].date));
        // Injection JS conservée uniquement pour ce cas exceptionnel
        const html = `
            <section class="cards-date">
                <p>Aucun créneau disponible pour ce matching.<br>
                Le jour le plus proche est : <strong>${firstToUpper(bestDay)}</strong><br>
                Vous pouvez relancer un matching en cliquant
                <span class="span-redirect">ici</span></p>
            </section>`;
        $("#frame-right").append(html);
        return;
    }

    for (let i = 0; i < 3; i++) {
        const day = dates[i];
        if (!day || !day.slots.length) continue;

        // Afficher la section du jour
        const $card = $(`#cards-date-${i}`);
        $card.removeAttr("hidden");

        // Libellé de la date
        $(`#date-label-${i}`).text(
            firstToUpper(parseDateToFrench(new Date(day.date)))
        );

        // Hydrater chaque slot
        day.slots.forEach(slot => {
            const startStr = new Date(slot.start).toLocaleString();
            const endStr = new Date(slot.end).toLocaleString();
            const hourStart = parseStrDateToHours(startStr);
            const hourEnd = parseStrDateToHours(endStr);
            const period = slot.period === "matin" ? "AM" : "PM";

            const $slot = $(`#slot-${period}-${i}`);
            $slot.removeAttr("hidden");
            $(`#slot-hours-${period}-${i}`).text(`De ${hourStart} à ${hourEnd}`);
        });
    }
}



// ── Mise à jour du DOM après validation de la date
function setDomAfterSubmit(dateString, hourStartString, hourEndString) {
    scrollTo(0, 0);

    // Message de succès
    $("#message-alert").html(`
        <p style="background:white; color:green; padding:8px 20px; font-size:18px">
            L'événement a été enregistré avec succès.
            Tous les participants ont reçu une notification par email.
        </p>`);

    // Supprimer les cards de choix
    $(".cards-date").remove();

    // Afficher la card de confirmation
    const htmlCard = `
        <div class="cards-date" style="width:100%; padding:16px; border-radius:8px;">
            <p style="margin:0 0 8px 0; font-size:16px; font-weight:600; color:#1a1a1a;">
                📅 ${dateString}
            </p>
            <p style="margin:0; font-size:14px; color:#666; display:flex; align-items:center; gap:6px;">
                <span>🕐</span>
                <span>De ${hourStartString} à ${hourEndString}</span>
            </p>
        </div>`;
    $("#frame-right").append(htmlCard);

    // Badge → Confirmé
    $("#badge-status")
        .text("CONFIRMÉ")
        .css({
            background: "linear-gradient(90deg, rgba(75,222,102,1) 0%, rgba(108,217,130,1) 26%, rgba(157,214,122,1) 77%, rgba(163,217,54,1) 100%)"
        });

    $(".message-info").remove()
}



//Flux principal
$(async function () {
    const config = await getConfig();
    const host = config.host;

    const token = window.location.href.split("=")[1];

    const res = await fetch(`${host}/api/matching-event/get?token=${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();

    if (!data.success) {
        createClassiqueModale(
            "Cet évènement n'est pas valide ou est déjà terminé, vous allez être redirigé vers la page d'accueil"
        );
        $("#btn-confirm-classique-modale").remove();
        setTimeout(() => window.location.href = `${host}/index`, 5500);
        return;
    }

    const dates = data.event.data.resolve;

    // Hydratation
    hydrateDomTextDataEvent(data);
    hydrateDateCards(dates);



    //Event Listener
    // Ouverture de la modale de confirmation 
    $(".btn-submit").on("click", function (e) {
        e.preventDefault();

        const id = $(this).prop("id");
        const parts = id.split("-");
        const period = parts[2] === "AM" ? "matin" : "après-midi";
        const idx = parseInt(parts[3], 10);

        const day = dates[idx];
        const slot = day.slots.find(s => s.period === period)
            ?? day.slots[0];

        const dateStart = new Date(slot.start);
        const dateEnd = new Date(slot.end);
        const strStart = parseStrDateToHours(dateStart.toLocaleString("fr-FR"));
        const strEnd = parseStrDateToHours(dateEnd.toLocaleString("fr-FR"));
        const strDate = firstToUpper(parseDateToFrench(dateStart));

        const html = `
            <div style="padding:20px;">
                <input type="hidden" id="event-date-start" value="${slot.start}">
                    <input type="hidden" id="event-date-start-string" value="${strStart}">
                        <input type="hidden" id="event-date-end" value="${slot.end}">
                            <input type="hidden" id="event-date-end-string" value="${strEnd}">
                                <input type="hidden" id="event-date-string" value="${strDate}">

                                    <div style="background:#f8f9fa; border-left:4px solid #7c3aed;
                            padding:16px; border-radius:4px; margin-bottom:20px;">
                                        <p style="margin:0 0 8px 0; font-size:15px; color:#333;">
                                            📅 <strong>${strDate}</strong>
                                        </p>
                                        <p style="margin:0; font-size:14px; color:#666;">
                                            🕐 De ${strStart} à ${strEnd}
                                        </p>
                                    </div>

                                    <p style="margin:0 0 12px 0; font-size:15px; color:#2c2c2c; line-height:1.5;">
                                        Si cet horaire vous convient, vous pouvez confirmer.
                                    </p>
                                    <p style="margin:0 0 16px 0; font-size:15px; color:#777; line-height:1.5;">
                                        ℹ️ Les participants recevront une notification par email
                                        de la confirmation du rendez-vous.
                                    </p>
                                </div>`;

        createClassiqueModale(html);
        $(".classique-modale-footer").append(
            "<button class='btn-primary' id='btn-submit-matching'>Confirmer</button>"
        );
    });


    // Confirmation définitive du créneau
    $(document).on("click", "#btn-submit-matching", async function (e) {
        e.preventDefault();

        const start = $("#event-date-start").val();
        const end = $("#event-date-end").val();
        const dateEventStr = $("#event-date-string").val();
        const hoursStartStr = $("#event-date-start-string").val();
        const hoursEndStr = $("#event-date-end-string").val();
        const titleEvent = $("#event-title").text();

        $("#btn-confirm-classique-modale").click();

        await fetch(`${host}/api/matching-event/final`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dateStart: start,
                dateEnd: end,
                token,
                titleEvent,
                dateEventString: dateEventStr,
                hoursStartString: hoursStartStr,
                hoursEndString: hoursEndStr
            })
        });

        setDomAfterSubmit(dateEventStr, hoursStartStr, hoursEndStr);
    });


    // Redirection vers l'agenda si relance du matching
    $(document).on("click", ".span-redirect", function (e) {
        e.preventDefault();
        window.location.href = `${host}/agenda`;
    });
});