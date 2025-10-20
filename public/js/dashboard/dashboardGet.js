

//Hydrate la page
const token = window.localStorage.getItem("token")

const getcredit = async () => {
    const res = await fetch("http://localhost:3000/api/credit/get", {
        method: "GET",
        headers: {
            "Content-type": "Application/json",
            "Authorization": "bearer " + token
        }
    })
    const resJson = await res.json()
    const data = resJson.data
    $("#credit-email").text(data.mail)
    $("#credit-sms").text(data.sms)
    $("#date-rechargement").text(parsingDate(data.refreshAt))
    $("#user-plan").text(data.plan)
}




const getEvent = async () => {
    const res = await fetch("http://localhost:3000/api/event/get", {
        method: "GET",
        headers: {
            "Content-type": "Application/json",
            "Authorization": "bearer " + token
        }
    })
    const data = await res.json()
    const events = data.event.data

    if(events.length == 0){
        $(".frame-append-event").append("<p style='margin:10px; font-weight:500'>Vous n'avez pas d'évenement en cours.</p>")
    }

    events.map((e) => {
        if (!e.response) {
            e.response = "En attente de réponse."
        }
        const arrPlateform = JSON.parse(e.plateformSender);
        e.response === ""
        const html = `<div class="cards-event" data-event-id="${e.id}">
                <button class="delete-event-btn" aria-label="Supprimer l'événement" title="Archiver">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                    <span class="tooltip-text">Archiver</span>
                </button>
                <p>Evenement créé le : ${parsingDate(e.createdAt)}</p>
                <p>Destinataire : <strong>${e.recipientName}</strong></p>
                <p>Etat : <strong>${e.state}</strong></p>
                <p>Methode d'envois : <strong>${arrPlateform}</strong></p>
                <p>A l'adresse : <strong>${e.recipientContactEmail}</strong></p>
                <p>Titre rendez-vous : <strong>${e.titleEvent}</strong></p>
                <p>Message complémentaire : <strong>${e.messageEvent}</strong></p>
                <p>Reponse : <strong>${e.response}</strong></p>
                <p>Message renvoyé par le destinataire (optionnel) : <strong>${e.messageReturn}</strong></p>
                </div>`

        $(".frame-append-event").append(html)
    })
}
getcredit()
getEvent()

