
const frDay = (numericDay) => {
    switch (numericDay) {
        case 0: return "dim.";
        case 1: return "lun.";
        case 2: return "mar.";
        case 3: return "mer.";
        case 4: return "jeu.";
        case 5: return "ven.";
        case 6: return "sam.";
        default: return "";
    }
}


const tagRappelState = (state) => {
    const tagAttente = `
        <span class="tag-attente">
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"
                focusable="false" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>En attente</span>`

    const tagAccept = `
        <span
            class="tag-accepted">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
        focusable="false" aria-hidden="true">
            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
            <path d="m9 11 3 3L22 4"></path>
        </svg>
    Envoyé
    </span >`


    const tagRefuse = `
    <span class="tag-refused">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     focusable="false" aria-hidden="true">
     <circle cx="12" cy="12" r="10"></circle>
    <path d="m15 9-6 6"></path>
    <path d="m9 9 6 6"></path>
    </svg>Echec de l'envoi</span>`

    if (state == "envoyé") {
        return tagAccept
    }

    if (state == "attente") {
        return tagAttente
    }
    if (state == "error") {
        return tagRefuse
    }
}

const getState = (state, method) => {

    const methodEmail = method.includes("EMAIL")
    const methodSms = method.includes("SMS")

    if (state.email?.error || state.sms?.error) {
        return "error"
    }

    if ((methodEmail && state.email?.sentAt) || (methodSms && state.sms?.sentAt)) {
        return "envoyé"
    }

    return "attente"
}

export const setRappelCard = (data) => {
    
    const methodUsed = data.method.toUpperCase()
    const recipientName = `${data.recipientNom} ${data.recipientPrenom}` || data.email || data.phone
    const idRappel = data.id
    const rappelDatetime = new Date(data.dayEvent)
    const dateFr = rappelDatetime.toLocaleDateString("FR-fr", { day: "numeric", month: "long" })
    const dateString = `${frDay(rappelDatetime.getDay())} ${dateFr} à ${rappelDatetime.getHours()}:${String(rappelDatetime.getMinutes()).padStart(2, "0")}`

    const state = getState(data.state, methodUsed)
    const tagState = tagRappelState(state)
    

    return `
    <div class='card-row'>
        <div class="flex-row">
            <div class="svg-container">
                <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                focusable="false" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            </div>

            <div class="small-flex-column">
                <span style="font-weight:500; font-size:16px">${recipientName}</span>
                <span class="subtitle">${dateString}</span>
            </div>
        </div>

        <div class="flex-row">
            <span class="tag">${methodUsed}</span>
            
            ${tagState}

            
            <button class="btn-delete" data-id="${idRappel}" data-section="rappel-rdv" data-restor="${state !== "envoyé" ? methodUsed : false}">
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    class="btn-icon"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    focusable="false" aria-hidden="true"
                    >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" x2="10" y1="11" y2="17"></line>
                    <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
                <span>${state == "envoyé" ? "Archiver" : "Supprimer"}</span>
            </button>
        </div>
    </div>`
}

export function setTagRappelAttente(rappelsRdv) {
    let count = 0;
    for (let i = 0; i < rappelsRdv.data.length; i++) {
        const methodIsSms = rappelsRdv.data[i].method.includes("sms")
        const methodIsEmail = rappelsRdv.data[i].method.includes("email")

        if (methodIsSms && rappelsRdv.data[i].state.sms.sentAt === null) {
            count++
            continue
        }
        if (methodIsEmail && rappelsRdv.data[i].state.email.sentAt === null) {
            count++
            continue
        }
    }



    rappelsRdv.data.length > 0
        ? $("#tag-rappel-attente").text(rappelsRdv.data.length > 1
            ? `${count} rappels en attente`
            : `${count} rappel en attente`)
        : $("#tag-rappel-attente").text("Vous n'avez aucun rappel en attente")
}