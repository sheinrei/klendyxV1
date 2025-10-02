//gestion du formulaire de confirmation d'un event par un client de user

const btnValid = document.getElementById("btn-accepter")
const btnRefuse = document.getElementById("btn-refuse")
const message = document.getElementById("response-message")
const messageAlert = document.getElementById("message-alert")

let lock = false;

async function updatingEvent(responseUser, message) {
    const params = window.location.pathname.split("/");
    const token = params[4];
    const id = params[5];
    const idEvent = params[6];

    const res = await fetch(`http://localhost:3000/api/event/update`, {
        method: 'POST',
        headers: {
            'Content-type': 'Application/json'
        },
        body: JSON.stringify({
            responseUser,
            message,
            token,
            id,
            idEvent,
        })

    })
    const data = await res.json()
    return data
}

btnValid.addEventListener("click", async function (e) {
    e.preventDefault();
    if (!lock) {
        const messageSend = message.value;
        const r = await updatingEvent("Validé", messageSend);
        messageAlert.textContent = r.message;
        lock = true
    } else {
        messageAlert.textContent = "Notification déjà envoyé. Impossible de changer."
    }
})

btnRefuse.addEventListener("click", async function (e) {
    e.preventDefault();
    if (!lock) {
        const messageSend = message.value;
        const r = await updatingEvent("Refusé", messageSend);
        messageAlert.textContent = r.message;
        lock = true
    } else {
        messageAlert.textContent = "Notification déjà envoyé. Impossible de changer."
    }
})