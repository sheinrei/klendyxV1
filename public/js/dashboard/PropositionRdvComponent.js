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


const setBtnUpdate = (idProposition) => `
            <button class="btn-primary btn-update-proposition" data-id=${idProposition} >
            <div class="svg-container-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen h-3.5 w-3.5"
                    focusable="false" aria-hidden="true">
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                </svg>
            </div>
                Modifier
            </button>
`



const setBtnDelete = (idProposition, state) => `
            <button class="btn-delete" data-id="${idProposition}" data-section="proposition-rdv">
                <div class="svg-container-small">
                <svg xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
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
                </div>
                <span>${state == "Repondu" ? "Archiver" : "Supprimer"}</span>
            </button>
`

const tagRecipientResponse = (data) => {
    const tagAttente = `
        <span class="tag-attente">
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"
                focusable="false" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg> En attente</span>`

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
                stroke-linejoin="round
        focusable="false" aria-hidden="true">
            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
            <path d="m9 11 3 3L22 4"></path>
        </svg>
    Accepté
    </span >`


    const tagRefuse = `
    <span class="tag-refused">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     focusable="false" aria-hidden="true">
     <circle cx="12" cy="12" r="10"></circle>
    <path d="m15 9-6 6"></path>
    <path d="m9 9 6 6"></path>
    </svg> Refusé</span>`

    if (data.state !== "Repondu") {
        return tagAttente
    }

    if (data.recipientReponse) {
        return tagAccept
    } else {
        return tagRefuse
    }
}




export const setPropositionCard = (data) => {

    console.log(data)
    const idProposition = data.id
    const { recipientName, dayStart, hourStart, hourEnd } = data


    const propositionDate = new Date(dayStart)
    const dateFr = propositionDate.toLocaleDateString("FR-fr", { day: "numeric", month: "long" })
    const dateString = `${frDay(propositionDate.getDay())} ${dateFr} de ${hourStart} à ${hourEnd}`


    return `
    <div class='card' style="margin-bottom:12px">
        <div class="flex-row"  style="justify-content:space-between">
            <div class="flex-row">
                <div class="svg-container">
                    <svg class="svg" xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" focusable="false" aria-hidden="true">
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                        <path d="m21.854 2.147-10.94 10.939"></path>
                    </svg>
                </div>

                <div class="small-flex-column">
                    <span style="font-weight:500; font-size:16px">${recipientName}</span>
                    <span class="subtitle">${dateString}</span>
                </div>
            </div>

            <div class="flex-col">
                <div class="flex-row">
                    ${tagRecipientResponse(data)}
                    ${data.state === "Repondu" ? setBtnDelete(idProposition, data.state) : setBtnUpdate(idProposition)}
                </div>
            </div>
        </div>

        ${data.state === "Repondu"
            ? `<div style="margin-top:10px">
                    <span class="subtitle">Commentaire ajouté à la réponse : ${data.recipientComment || "Aucun commentaire"}</span>
                </div>`
            : `<div style="margin-top:10px">
                    <span class="subtitle">Proposition envoyé le ${new Date(data.createdAt).toLocaleDateString("FR-fr", { day: "numeric", month: "short" })}</span>
                </div>` }
    </div>`
}











/* ARCHIVES */

/* 

const setBtnReSend = (idProposition) => `
            <button class="btn-primary-dashboard"  data-id=${idProposition}>
            <div class="svg-container-small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send h-3.5 w-3.5"
                    focusable="false" aria-hidden="true">
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                    <path d="m21.854 2.147-10.94 10.939"></path>
                </svg>
            </div>
                Renvoyer
            </button>
` */