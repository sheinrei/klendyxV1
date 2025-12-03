//déclachemet de la route pour la logique forgot-password by email


$("#submit-forgot-password").on("click", async function (e) {
    e.preventDefault()
    MessageAlert.removeMessage()
    const email = $("#email").val()
    const inputMessageAlert = "#input-message-alert"
    if (!email) {
        MessageAlert.create("warning", inputMessageAlert, "Merci de renseigner une adresse email")
        return
    }

    const valideEmail = validateEmail(email)
    if (!valideEmail) {
        MessageAlert.create("warning", inputMessageAlert, "Merci de renseigner une adresse email valide")
    }

    const config = await getConfig()
    const host = config.host


    $.ajax({
        url: `${host}/api/user/email/new-password`,
        method: "post",
        contentType: "application/json",
        data: JSON.stringify(
            { emailTarget: email }
        ),
    })

    MessageAlert.create("information", inputMessageAlert, "Un e-mail de réinitialisation de mot de passe vous a été envoyé")
})
