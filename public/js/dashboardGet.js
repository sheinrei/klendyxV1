

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
    console.log(events)



    events.map((e) => {
        if (!e.response) {
            e.response = "En attente de réponse."
        }
        const arrPlateform = JSON.parse(e.plateformSender);


        const html = `<div class="cards-event">
                <p>Evenement créé le : ${parsingDate(e.createdAt)}</p>
                <p>Destinataire :  ${e.recipientName}</p>
                <p>Etat : ${e.state}</p>
                <p>Methode d'envois : ${arrPlateform}</p>
                <p>A l'adresse : ${e.recipientContactEmail}</p>
                <p>Motif event : ${e.titleEvent}</p>
                <p>Message complémentaire : ${e.messageEvent}</p>
                <p>Reponse : ${e.response}</p>
                </div>`

        $("#event").append(html)
    })
}
getcredit()
getEvent()