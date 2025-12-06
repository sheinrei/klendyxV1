function controleInput(nom, prenom, email, validEmail, phone, dayStart, hourStart, hourEnd, title, methodContactSms, methodContactEmail) {

    if (!nom) {
        $("#data-rdv-nom").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir un nom");
        return false
    }

    if (!prenom) {
        $("#data-rdv-prenom").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir un prenom");
        return false
    }

    if (!email && methodContactEmail) {
        $("#data-rdv-email").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir une adresse email");
        return false
    }

    if (!validEmail && methodContactEmail) {
        $("#data-rdv-email").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir une adresse email valide");
        return false
    }

    if (!phone && methodContactSms) {
        $("#data-rdv-phone").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir une numméro de téléphone");
        return false
    }

    if (!methodContactEmail && !methodContactSms) {
        $(".label-full-row").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez sélectionner une methode de contact");
        return false
    }

    if (!dayStart) {
        $("#data-rdv-day-start").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir une date");
        return false
    }

    if (!hourStart) {
        $("#data-rdv-horraire-start").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir l'heure de début");
        return false
    }

    if (!hourEnd) {
        $("#data-rdv-horraire-end").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir l'heure de fin");
        return false
    }

    if (!title) {
        $("#data-rdv-title").css("border", "1px solid red");
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir un titre pour le rendez-vous");
        return false
    }
    return true

}

function resetCss() {
    $("#data-rdv-nom").css("border", "1px solid var(--border-color")
    $("#data-rdv-prenom").css("border", "1px solid var(--border-color")
    $("#data-rdv-email").css("border", "1px solid var(--border-color")
    $("#data-rdv-phone").css("border", "1px solid var(--border-color")
    $("#data-rdv-title").css("border", "1px solid var(--border-color")
    $("#data-rdv-day-start").css("border", "1px solid var(--border-color")
    $("#data-rdv-horraire-start").css("border", "1px solid var(--border-color")
    $("#data-rdv-horraire-end").css("border", "1px solid var(--border-color")
    $(".label-full-row").css("border", "1px solid var(--border-color")

}

//Renvois le phone au forat +33...
function parseSmsNumber(phone) {
    let result = phone.split(" ").join("");
    const size = result.length

    if ((result[0] !== "+" && size !== 10) || (result[0] === "+" && size !== 12)) {
        return { success: false, message: "Longueur du numero de tel incorrect", phone: result, size }
    }

    if (result[0] !== "+") {
        result = "+33" + result.slice(1)
    }
    return { success: true, message: "Numero tel au bon format", phone: result }
}


$("#btn-submit-rdv").on("click", async function (e) {
    e.preventDefault()
    resetCss()
    MessageAlert.removeMessage()
    const config = await getConfig()
    const host = config.host;

    console.log("debut du submit")

    const nom = $("#data-rdv-nom").val()
    const prenom = $("#data-rdv-prenom").val()
    const email = $("#data-rdv-email").val()

    const validEmail = validateEmail(email)
    let phone = $("#data-rdv-phone").val()

    const dayStart = $("#data-rdv-day-start").val()
    const hourStart = $("#data-rdv-horraire-start").val()
    const hourEnd = $("#data-rdv-horraire-end").val()

    const title = $("#data-rdv-title").val();
    const commentaire = $("#data-rdv-commentaire").val()

    const methodContactSms = $("#contact-method-sms").is(":checked")
    const methodContactEmail = $("#contact-method-email").is(":checked")

    const rappel = $("#btn-toggle-switch-rappel").is(":checked")
    const timeRappel = $("#data-rdv-hour-rappel").val()

    const allInputValid = controleInput(nom, prenom, email, validEmail, phone, dayStart, hourStart, hourEnd, title, methodContactSms, methodContactEmail)

    if (!allInputValid) return

    if (methodContactSms) {
        const validPhone = parseSmsNumber(phone);

        if (!validPhone.success) {
            $("#data-rdv-phone").css("border", "1px solid red");
            scrollTo()
            MessageAlert.create("warning", "#input-message-alert", "Veuillez saisir un numéro de téléphone valide");
            return 
        }
        phone = validPhone.phone
    }


    const sending = await fetch(`${host}/api/rdv/sending`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            nom,
            prenom,
            email,
            phone,
            dayStart,
            hourStart,
            hourEnd,
            title,
            commentaire,
            methodContactSms,
            methodContactEmail,
            rappel,
            timeRappel
        })
    })

    const resSending = await sending.json()
    console.log(resSending)

})