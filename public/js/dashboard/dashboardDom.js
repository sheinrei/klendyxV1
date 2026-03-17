import { getAllRappelRdv, deleteRappel, getPropositionRdv, getCurrentCredit, getSyncProvider, createRappelRdv, deletePropositionRdv, updatePropositionRdv } from "./fetchData.js";
import { setRappelCard, setTagRappelAttente } from "./rappelRdvComponent.js"
import { setPropositionCard } from "./PropositionRdvComponent.js"
import GraphChargeWeek from "./GraphChargeWeek.js";
import { rappelFormHTML, btnSubmitNewRappel, setTemplateFormUpdateProposition } from "./templateFormModale.js";

// NAVIGATION des sections
const sections = {
    "rappel-rdv": "#section-rappel-rdv",
    "proposition-rdv": "#section-proposition-rdv",
    "abonnement": "#section-crédit-abonnement",
    "agenda": "#section-agenda"
};

// gestion des hide de chaque sections
const showSection = (sectionSelector) => {
    Object.values(sections).forEach(e => $(e).hide());
    $(sectionSelector).show();
    $("button").removeClass("btn-link-activ")
};

// Boucle complette pour les events de click navgation
Object.entries(sections).forEach(([key, selector]) => {
    $(`#btn-link-${key}`).on("click", function () {
        showSection(selector)
        $(this).addClass("btn-link-activ")
    });
});




//DOM Section rappel rdv
const rappelsRdv = await getAllRappelRdv()

rappelsRdv.data.map(rappel => {
    const htmlElement = setRappelCard(rappel)
    $("#section-card-rappel").append(htmlElement)

})

setTagRappelAttente(rappelsRdv)


//DOM Event listener delete global
$("body").on("click", ".btn-delete", async function (e) {
    e.preventDefault()
    const id = $(this).data("id");
    const section = $(this).data("section")
    if (section == "rappel-rdv") {
        const deleted = await deleteRappel(id)

        if (deleted.success) {
            $(this).closest(".card-row").remove()
            MessageAlert.create("information", "#input-message-alert", deleted.message)
            const dataRappelUpdate = await getAllRappelRdv()
            setTagRappelAttente(dataRappelUpdate)

        }
    }
    if (section == "proposition-rdv") {

        const deleted = await deletePropositionRdv(id)
        MessageAlert.create("information", "#input-message-alert", deleted.message)
        MessageAlert.removeMessage()
        if (deleted.success) {
            $(this).closest(".card").remove()
        }
    }
})




//Gestion création new rdv
$("#btn-create-rappel").on("click", () => {
    createClassiqueModale(rappelFormHTML)
    $(".classique-modale-footer").append(btnSubmitNewRappel)

})




//Event listener submit new rappel rdv
$("body").on("click", "#btn-submit-new-rappel", async () => {
    const phone = $("#rappel-phone").val()
    const email = $("#rappel-email").val()
    const method = $("#rappel-method").val()
    const dayEvent = $("#rappel-date").val()
    const hourBefore = $("#rappel-hour-before").val()
    const hourStart = $("#rappel-hour-start").val()
    const hourEnd = $("#rappel-hour-end").val()
    const nom = $("#rappel-nom").val()
    const prenom = $("#rappel-prenom").val()

    if (!prenom || !nom) {
        MessageAlert.create("error", "#modale-input-message-alert", "Veuillez saisir le nom et prénom du destinataire.")
        MessageAlert.removeMessage()
        return
    }

    if (!dayEvent) {
        MessageAlert.create("error", "#modale-input-message-alert", "Veuillez saisir une date.")
        MessageAlert.removeMessage()
        return
    }

    if (!hourStart || !hourEnd) {
        MessageAlert.create("error", "#modale-input-message-alert", "Veuillez saisir une heure de début et de fin.")
        MessageAlert.removeMessage()
        return
    }
    if (!phone && !method.includes("sms")) {
        console.log("pas de sms")

        MessageAlert.create("error", "#modale-input-message-alert", "Veuillez saisir un numéro de téléphone si la méthode d'envoi est définie avec SMS.")
        $(".classique-modale").scrollTop($(".classique-modale-header").scrollTop() + 100);

        MessageAlert.removeMessage()
        return
    }

    if (!email && method.includes("email")) {
        MessageAlert.create("error", "#modale-input-message-alert", "Veuillez saisir un email si la méthode d'envoi est définie avec Email.")
        MessageAlert.removeMessage()
        return
    }






    const created = await createRappelRdv(phone, email, method, dayEvent, hourBefore, hourStart, hourEnd, nom, prenom);

    if (!created.success) {
        MessageAlert.create("error", "#input-message-alert", created.message)
        setTimeout(() => {
            MessageAlert.removeMessage()
        }, 5000)
    }

    closeClassiqueModale()

    console.log("id qui veitn d'être créé", created.id)

    const dataCard = {
        method,
        state: created.state,
        id: created.id,
        dayEvent: created.dayEvent,
        recipientNom: nom,
        recipientPrenom: prenom
    }

    const newCard = setRappelCard(dataCard)
    $("#section-card-rappel").append(newCard)
    const numberCard = $(".card-row")
    $("#tag-rappel-attente").text(`${numberCard.length} rappel en attente`)
    //message alerte
    MessageAlert.create("success", "#input-message-alert", created.message)
    setTimeout(() => {
        MessageAlert.removeMessage()
    }, 5000)
})








/* ===============================
DOM Section Proposition rdv
=============================== */

//création et injection des cards proposition
const propositions = await getPropositionRdv()
propositions.data.map(proposition => {
    const html = setPropositionCard(proposition)
    $("#section-card-proposition").append(html)
})



//event listener update proposition
$(".btn-update-proposition").on("click", function (e) {
    const id = $(this).data("id");
    const thisEvent = propositions.data.filter(p => p.id == id)
    console.log("Cet event a update : ", thisEvent)
    createClassiqueModale(setTemplateFormUpdateProposition(thisEvent[0]))
    $(".classique-modale-footer").append(`<button class="btn-primary" id="submit-update-proposition">Valider et envoyer</button>`)
})

$("body").on("click", "#submit-update-proposition", async () => {
    console.log("updating purpose")
    const title = $("#update-proposition-title").val()
    const recipientName = $("#update-proposition-recipient-name").val()
    const dayStart = $("#update-proposition-day-start").val();
    const hourStart = $("#update-proposition-hour-start").val()
    const hourEnd = $("#update-proposition-hour-end").val();
    const method = $("#update-proposition-method").val();
    const recipientEmail = $("#update-proposition-email").val()
    const recipientPhone = $("#update-proposition-phone").val()

    const methodContactSms = method.includes("sms")
    const methodContactEmail = method.includes("email")

    await updatePropositionRdv({ title, recipientName, dayStart, hourEnd, hourStart, recipientEmail, recipientPhone, methodContactSms, methodContactEmail })
})






/* ===============================
DOM Section section credit
=============================== */

const plansAbonnement = {
    "essais gratuit": {
        sms: 5,
        email: 20,
        price: "0€/semaine"
    },
    "starter": {
        sms: 50,
        email: 200,
        price: "19€/mois"
    },
    "pro": {
        sms: 200,
        email: 1000,
        price: "49€/mois"
    },
    "ultimate": {
        sms: 500,
        email: 99999,
        price: "94€/mois"
    }
}

//recuperation des données
const credit = await getCurrentCredit()
const { sms, email, refreshAt, plan } = credit.data

//mapping sur les deux cards de credit
for (const method of ["sms", "email"]) {
    const credit = method === "sms" ? sms : email

    //max value de la progress
    $(`#progress-credit-${method}`).attr("max", plansAbonnement[plan][method])

    //Texte liée aux crédits
    $(`#text-credit-${method}`).text(`${credit} restants sur ${plansAbonnement[plan][method]}`)

    //value de la progress
    $(`#progress-credit-${method}`).attr("value", plansAbonnement[plan][method] - credit)

    //text credit used/period
    $(`#credit-${method}-used`).text(`${plansAbonnement[plan][method] - credit} ${method} envoyés ${plan == "essais gratuit" ? "cette semaine" : "ce mois"}`)
}


$("#credit-header-date-refresh").text(`Votre abonnement se renouvelle automatiquement le ${new Date(refreshAt).toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })}`)
$("#plan-name").text(`Abonnement : ${plan} `)
$("#credit-text-billing").text(`${plansAbonnement[plan].price} · Renouvelé le ${new Date(refreshAt).toLocaleDateString("FR-fr")}`)




/* ===============================
DOM Section section agenda
=============================== */
const calendarSync = await getSyncProvider()

const badgeConnected = `
<div class="badge-calendar-sync-active" role="status" aria-label="Calendrier connecté">
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
    <span>Connecté</span>
</div>`;

const badgeNotConnected = `
<div class="badge-calendar-sync-none" role="status" aria-label="Calendrier non connecté">
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
     </svg>
    <span>Non connecté</span>
</div>`;

for (const provider of ["google", "apple", "outlook"]) {

    const isSync = calendarSync[provider]?.sync

    //badge selon state synchronisation
    $(`#badge-sync-${provider}`).append(isSync ? badgeConnected : badgeNotConnected)

    //css de la cards selon state synchronisation
    $(`#card-sync-${provider}`).addClass(isSync ? "card-sync-active" : "card-sync-none")

    //Date de la synchronisation
    $(`#date-sync-${provider}`).text(isSync ? `Depuis le ${calendarSync[provider]?.createdAt}` : `Non connecté`)

    //affichage du bouton pour synchroniser
    $(`#btn-sync-calendar-${provider}`).css("display", isSync ? "none" : "block");

}


$("#sync-calendar-google").on("click", () => window.location.href = "/api/calendar/google/auth")
$("#sync-calendar-outlook").on("click", () => window.location.href = "/api/calendar/outlook/auth")
$("#sync-calendar-apple").on("click", () => window.location.href = "/auth-icloud")

//graph
const graph = new GraphChargeWeek(calendarSync);
graph.init();
