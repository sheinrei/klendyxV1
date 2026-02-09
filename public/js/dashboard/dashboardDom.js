import GraphController from "./GraphController.js";
import {
    getCurrentCredit,
    getDataCalendar,
    getPropositionRdv,
} from "./fetchData.js";



function getCountHoursEventInDay(event) {
    const start = new Date(event.dateStart);
    const end = new Date(event.dateEnd);
    const diff = end.getTime() - start.getTime();
    return (diff / 1000 / 60 / 60)
};



function setDateWeek(switchWeek = 0) {
    const week = [];
    const today = new Date();

    const currentDay = today.getDay();
    const currentDate = today.getDate();

    const mondayDate = currentDay === 0
        ? currentDate - 6
        : currentDate - (currentDay - 1);


    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(mondayDate + i + (switchWeek * 7));
        week.push(date.toLocaleDateString());
    }


    return week;
}

function setDOMCredit(data) {
    $("#input-refresh-credit-date").text(data.refreshAt)
    $("#input-current-sms-count").text(data.sms)
    $("#input-current-email-count").text(data.mail)
    $("#user-abonnement").text(data.plan)
}

async function setDOMCalendarSync(graphController, calendar) {
    const textGoogleSync = calendar.google.sync ? "Synchronisé" : "Non synchronisé";
    $("#user-calendar-sync-google").text(textGoogleSync);
    $("#user-calendar-sync-outlook").text(calendar.outlook.sync ? "Synchronisé" : "Non synchronisé");
    $("#user-calendar-sync-apple").text(calendar.apple.sync ? "Synchronisé" : "Non synchronisé");
    const dataGraph = []
    const labels = []
    if (calendar.google.sync) {
        const data = await getDataCalendar("google");
        dataGraph.push(data.data.data.count);
        labels.push("Google")

    }
    if (calendar.outlook.sync) {
        const data = await getDataCalendar("outlook");
        dataGraph.push(data.data.data.count);
        labels.push("Outlook")
    }
    if (calendar.apple.sync) {
        const data = await getDataCalendar("apple");
        dataGraph.push(data.data.data.count);
        labels.push("Apple")
    }
    const dataKlendyx = await getDataCalendar("klendyx")
    dataGraph.push(dataKlendyx.data.data.count);
    labels.push("Klendyx")
    const ctx = document.getElementById("ctx-calendar-count")
    graphController.createGraph("doughnut", ctx, labels, dataGraph, "calendarSync")
}

function setGraphEnvoie(graphController) {
    const dataGraph = [12, 13, 12, 2, 12, 2, 1]
    const labels = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
    const ctx = document.getElementById("graph-envoie");
    graphController.createGraph("bar", ctx, labels, dataGraph, "envoieGraph")
}

async function setGraphPropositionRdv(graphController) {
    const ctx = document.getElementById("graph-proposition-rdv");
    let labels = ["En attente", "Accepté", "Refusé"];
    let dataGraph = [0, 0, 0]
    const data = await getPropositionRdv()

    if (data.data.length == 0) {
        dataGraph = [1];
        labels = ["Aucune Proposition de rendez-vous"]
    }

    data.data.forEach(proposition => {
        if (!proposition.recipientResponse) {
            dataGraph[0] += 1;
            return
        }
        switch (proposition.recipientReponse) {
            case "Accepté":
                dataGraph[1] += 1;
                break;
            case "Refusé":
                dataGraph[2] += 1;
                break
        }

    })

    graphController.createGraph("doughnut", ctx, labels, dataGraph, "propositionRdvGraph")
}


async function hydrateDataAndLabelsChargeWeek(dataCalendar, weekNumber) {
    const labels = setDateWeek(weekNumber);
    let data = [0, 0, 0, 0, 0, 0, 0];


    Object.entries(dataCalendar).forEach(([provider, events]) => {

        for (let i = 0; i < events.length; i++) {
            const date = new Date(events[i].dateStart).toLocaleDateString();

            for (let d = 0; d < labels.length; d++) {
                if (date === labels[d]) {
                    const minute = getCountHoursEventInDay(events[i]);
                    data[d] += minute;
                }
            }
        }
    });

    return {
        labels,
        data
    }
}


async function setGraphChargeEvent(graphController, dataCalendar, weekNumber) {
    const ctx = document.getElementById("graph-charge-event");
    const prepareGraph = await hydrateDataAndLabelsChargeWeek(dataCalendar, weekNumber)
    graphController.createGraph("line", ctx, prepareGraph.labels, prepareGraph.data, "Heures", "chargeEventGraph")
}


async function getAllDataCalendar(calendar) {
    try {
        const allData = {}
        if (calendar.google.sync) {
            const dataCalendar = await getDataCalendar("google");
            allData["google"] = dataCalendar.data.data.events
        }
        if (calendar.outlook.sync) {
            const dataCalendar = await getDataCalendar("google");
            allData["outlook"] = dataCalendar.data.data.events
        }
        if (calendar.apple.sync) {
            const dataCalendar = await getDataCalendar("apple");
            allData["apple"] = dataCalendar.data.data.events
        }
        const dataCalendar = await getDataCalendar("klendyx");
        allData["klendyx"] = dataCalendar.data.data.events;
        console.log("Toute les data des events", allData)
        return allData
    } catch (err) {
        console.log(err)
        throw new Error(`Echec lors de la récupération de tout les évènements des calendars. Erreur : ${err.message}, liste des calendar Sync : ${calendar.apple}`)
    }
}


async function setDOMPrositionRDV(data) {
    if (!data.data.length) {
        $("#subtitle-proposition-rdv").text("Vous n'avez pas de prosition de rendez-vous en cours");
        return
    }
    $("#subtitle-proposition-rdv").text(`Vous avez ${data.data.length} prosition${data.data.length <= 1 ? "" : "s"} de rendez-vous en cours`);

    data.data.forEach(proposition => {
        const html = `<div class="card-proposition">
        <header>
        <p>Proposition créé le  ${dateToFr(proposition.createdAt)}</p>
        </header>

            <p>Destinataire :<strong> ${proposition.recipientName} </strong></p>
            <p>Prosition de rendez-vous envoyé par ${proposition.methodContactEmail ? "email" : "sms"}</p>

            <p>Détail du rendez-vous : </p>
            <ul>
                <li>Titre : ${proposition.title} </li>
                <li>Date : ${dateToFr(proposition.dayStart)}</li>
                <li>Horaire: de ${proposition.hourStart.replace(":", "h")} à  ${proposition.hourEnd.replace(":", "h")}</li>
                <li>Commentaire ajouté : ${proposition.commentaire || "aucun"}</li>
                <li>Etat de l'avancement : ${proposition.state}</li>
            </ul>

            <footer style="display:flex;flex-direction:row; justify-content:center;gap:20px; background-color:#FFFFFF">
                <button class="btn-proposition delete-proposition" data-id="${proposition.id}">Supprimer la proposition</button>
                <button class="btn-proposition resend-proposition" data-id="${proposition.id}">Renvoyer la proposition</button>
            </footer>
        </div>`
        $("#input-cards-proposition-rdv").append(html)
    });
}



// === Initialisation ===
$(async function () {

    const res = await fetch("/config");
    const data = await res.json();
    const host = data.host



    // === Graphique ===
    const graphController = new GraphController();
    const credit = await getCurrentCredit()
    setDOMCredit(credit.credit.data)
    const calendarSync = await checkCalendarSync(host)
    setDOMCalendarSync(graphController, calendarSync)

    setGraphEnvoie(graphController)
    setGraphPropositionRdv(graphController)

    setDateWeek()
    const dataCalendar = await getAllDataCalendar(calendarSync)

    let weekNumber = 0
    setGraphChargeEvent(graphController, dataCalendar, weekNumber)

    const dataProposition = await getPropositionRdv();

    setDOMPrositionRDV(dataProposition)





    // event 
    $("#charge-event-previous-week").on("click", async function (e) {
        e.preventDefault();
        $(this).prop('disabled', true)
        weekNumber--
        const prepareGraph = await hydrateDataAndLabelsChargeWeek(dataCalendar, weekNumber)
        graphController.updateGraph("chargeEventGraph", prepareGraph.labels, prepareGraph.data);
        $(this).prop('disabled', false)
    })

    $("#charge-event-next-week").on("click", async function (e) {
        e.preventDefault();
        $(this).prop('disabled', true)
        weekNumber++
        const prepareGraph = await hydrateDataAndLabelsChargeWeek(dataCalendar, weekNumber)
        graphController.updateGraph("chargeEventGraph", prepareGraph.labels, prepareGraph.data)
        $(this).prop('disabled', false)
    })


    $(document).on("click", `.delete-proposition`, async function (e) {
        e.preventDefault();
        const propositionId = $(this).data("id")
        const deleted = await fetch(`${host}/api/rdv/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eventId: propositionId
            })
        })
        const data = await deleted.json()
        if (data.success) {
            createClassiqueModale("La prosition de rendez-vous a été supprimé avec succes");
            const card = $(this).closest(".card-proposition");
            $(card).remove()
        } else {
            createClassiqueModale(`${data.message}`)
        }

    })

    $(document).on("click", `.resend-proposition`, async function (e) {
        e.preventDefault();
        const propositionId = $(this).data("id")

        console.log(propositionId)
    })


})
