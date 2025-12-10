//gestion du formulaire de confirmation d'un event par un client de user
async function updatingProposition(responseUser) {
    const config = await getConfig()
    const host = config.host

    const message = $("#response-message").val()
    const params = window.location.pathname.split("/");
    const token = params[2];
    const id = params[3];
    const idEvent = params[4];

    const res = await fetch(`${host}/api/rdv/reponsePropositionRdv`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
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



$("#btn-accepter").on("click", async function (e) {
    e.preventDefault();

    const r = await updatingProposition(true);
    if (!r.success) {
        MessageAlert.create("warning", "#message-alert", r.message);
        return
    }
    MessageAlert.create("information", "#message-alert", r.message)
    $('button').prop('disabled', true);
})

$("#btn-refuser").on("click", async function (e) {
    e.preventDefault();
    const r = await updatingProposition(false);
    if (!r.success) {
        MessageAlert.create("warning", "#message-alert", r.message);
        return
    }
    MessageAlert.create("information", "#message-alert", r.message)
    $('button').prop('disabled', true);
})