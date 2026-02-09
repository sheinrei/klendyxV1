function createModaleDetailEvent(infos) {
    //remove si modale déjà présente
    $(".event-modale").remove()
    const def = infos.event._def
    const extProps = def.extendedProps;

    const {dateStart, dateEnd, eventId, title, description, provider } = extProps.data

    let duree = (new Date(dateEnd) - new Date(dateStart)) / 3600000;
    duree = parsingHours(duree)

    
    const dateToString = date =>{
        const ObjectDate = new Date (date)
        const string = ObjectDate.toLocaleTimeString()
        return string.slice(0,5).replace(":", "h")
    } 

    const dateStartString = dateToString(dateStart)
    const dateEndString = dateToString(dateEnd)

    const horraire = `De ${dateStartString} à ${dateEndString}`
    
    const htmlModale = `<div class="event-modale">
            <div class="modal-header">
                <div class="modal-title-section">
                    <h2 class="event-title" id="eventTitle">${firstToUpper(title)}</h2>
                </div>
                <button class="close-modale" id="btn-close-modale">&times;</button>
                <input type="hidden" id="fc-ext-props"  />
                <input type="hidden" id="fc-id-event" value="${extProps.fcId}"/>
            </div>

            <div class="modal-body">
                <div class="event-info-grid">


                    <div class="info-item">
                        <img width="20" height="20" src="https://img.icons8.com/ios/50/calendar--v1.png" alt="calendar--v1"/>
                        <div class="info-content">
                            <div class="info-label">Origine de l'evenement</div>
                            <div class="info-value" id="eventStart">Agenda ${provider}</div>
                        </div>
                    </div>



                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Date</div>
                            <div class="info-value" id="eventDate">${dateToFr(dateStart)}</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Horraire</div>
                            <div class="info-value" id="event-horraire">${horraire}</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Durée</div>
                            <div class="info-value" id="eventDuration">${duree}</div>
                        </div>
                    </div>


                    <div class="info-item" style="${origin === "klendyx" ? "dispay:flex" : "display:none"}">
                        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <div class="info-content">
                            <div class="info-label">Etat du rendez-vous</div>
                            <div class="info-value" id="klendyx-state-rdv">${extProps.data.state}</div>
                        </div>
                    </div>

                    <div class="info-item" style="${origin === "klendyx" && extProps.data.response ? "dispay:flex" : "display:none"}">
                        <img width="20" height="20" src="https://img.icons8.com/ios/50/email-open.png" alt="email-open"/>   
                        <div class="info-content">
                            <div class="info-label">Réponse </div>
                            <div class="info-value" id="klendyx-state-rdv" 
                            style="padding:4px; border:1px solid black;width:fit-content; color:white; border-radius:5px;background-color:${extProps.data.response === "Refusé" ? "red" : "green"}">
                            ${extProps.data.response}</div>

                            <div class="info-value" id="klendyx-state-rdv"
                                style="${extProps.data.messageReturn ? "dispay:flex" : "display:none"}">
                            Message retourné :<br>${extProps.data.messageReturn}
                            </div>

                        </div>
                    </div>


                <div class="event-description">
                    <div class="info-label" style="margin-bottom: 8px;">Description</div>
                    <p id="eventDescription">${description || "Aucune description saisie"}</p>
                </div>
            </div>

            <div class="modal-footer">
                <button id="btn-update-event" class="btn btn-primary">Modifier</button>
                <button id="btn-delete-event" class="btn btn-danger">Supprimer</button>
            </div>
        </div>

    </div>`


    $("body").append(htmlModale)
    $("#fc-ext-props").val(JSON.stringify(extProps.data))
}


$(document).on("click", ".close-modale", () => {
    $(".close-modale").closest(".event-modale").remove()
})




