

function createModale(infos) {

    const def = infos.event._def
    const range = infos.event._instance.range

    const title = def.title
    const start = range.start
    const end = range.end
    const duree = end - start;

    console.log(def.extendedProps.description)
    let description = def.extendedProps.description ? def.extendedProps.description : "Aucune description."


    const htmlModale = `<div class="event-modale">

            <div class="modal-header">
                <div class="modal-title-section">
                    <h2 class="event-title" id="eventTitle">${title}</h2>
                </div>
                <button class="close-modale">&times;</button>
            </div>

            <div class="modal-body">
                <div class="event-info-grid">

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Date de début</div>
                            <div class="info-value" id="eventStart">${start}</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Date de fin</div>
                            <div class="info-value" id="eventEnd">${end}</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Durée</div>
                            <div class="info-value" id="eventDuration">${duree / 3600}H</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Lieu</div>
                            <div class="info-value" id="eventLocation">Salle de conférence A</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Lien</div>
                            <div class="info-value" id="eventUrl">
                                <a href="#" style="color: #3b82f6; text-decoration: none;">https://meet.example.com/abc-def</a>
                            </div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Organisateur</div>
                            <div class="info-value" id="eventOrganizer">Marie Dupont</div>
                        </div>
                    </div>
                </div>

                <div class="event-description">
                    <div class="info-label" style="margin-bottom: 8px;">Description</div>
                    <p id="eventDescription">${description}</p>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Fermer</button>
                <button class="btn btn-primary" onclick="editEvent()">Modifier</button>
                <button class="btn btn-danger" onclick="deleteEvent()">Supprimer</button>
            </div>
        </div>

    </div>`




    $("body").append(htmlModale)
}

$(document).on("click", ".close-modale", () => {
    console.log("clicked")
    $(".close-modale").closest(".event-modale").remove()
})