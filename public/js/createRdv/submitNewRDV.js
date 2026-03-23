function invalidInput(elementInput, message) {
    $(elementInput).css("border", "1px solid red");
    scrollTo()
    MessageAlert.create("warning", "#input-message-alert", message)
}

function controleInput(nom, prenom, email, validEmail, phone, dayStart, hourStart, hourEnd, title, methodContactSms, methodContactEmail, creditEmail, creditSms) {

    if (!nom) {
        invalidInput("#data-rdv-nom", "Veuillez saisir un nom")
        return false
    }
    if (!prenom) {
        invalidInput("#data-rdv-prenom", "Veuillez saisir un prenom")
        return false
    }

    if (!email && methodContactEmail) {
        invalidInput("#data-rdv-email", "Veuillez saisir une adresse email")
        return false
    }

    if (!validEmail && methodContactEmail) {
        invalidInput("#data-rdv-email", "Veuillez saisir une adresse email valide")
        return false
    }

    if (!phone && methodContactSms) {
        invalidInput("#data-rdv-phone", "Veuillez saisir une numméro de téléphone")
        return false
    }

    if (!methodContactEmail && !methodContactSms) {
        invalidInput(".label-full-row", "Veuillez sélectionner une methode de contact")
        return false
    }

    if (!dayStart) {
        invalidInput("#data-rdv-day-start", "Veuillez saisir la date du rendez-vous")
        return false
    }

    if (!hourStart) {
        invalidInput("#data-rdv-horaire-start", "Veuillez saisir l'heure de début")
        return false
    }

    if (!hourEnd) {
        invalidInput("#data-rdv-horaire-end", "Veuillez saisir l'heure de fin")
        return false
    }

    if (!title) {
        invalidInput("#data-rdv-title", "Veuillez saisir le titre du rendez-vous")
        return false
    }

    if ((methodContactEmail || $("#data-rdv-rappel-method-email").is(":checked")) && creditEmail < 0) {
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Vos crédit d'envois d'email ne sont pas suffisant, veuillez ajouter du crédit ou attendre le rechargement hebdomadaire");
        return false
    }

    if ((methodContactSms || $("#data-rdv-rappel-method-sms").is(":checked")) && creditSms < 0) {
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Vos crédit d'envois de sms ne sont pas suffisant, veuillez ajouter du crédit ou attendre le rechargement hebdomadaire");
        return false
    }

    let rappel = $("#recapitulatif-rappel").text()
    rappel === "Désactivé" ? rappel = false : rappel = true;
    if (
        rappel && !(
            $("#data-rdv-rappel-method-sms").is(":checked")
            || $("#data-rdv-rappel-method-email").is(":checked")
        )
    ) {
        scrollTo()
        MessageAlert.create("warning", "#input-message-alert", "Vous avez activé le rappel mais pas définis de méthode pour l'envoyer");
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
    $("#data-rdv-horaire-start").css("border", "1px solid var(--border-color")
    $("#data-rdv-horaire-end").css("border", "1px solid var(--border-color")
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

function resetFormulaire() {
    $("#data-rdv-nom").val("")
    $("#data-rdv-prenom").val("")
    $("#data-rdv-email").val("")
    $("#data-rdv-phone").val("")
    $("#data-rdv-day-start").val("")
    $("#data-rdv-horaire-start").val("")
    $("#data-rdv-horaire-end").val("")
    $("#data-rdv-title").val("")
    $("#data-rdv-commentaire").val("")


    $("#recapitulatif-client").text("--")
    $("#recapitulatif-date").text("--")
    $("#recapitulatif-titre").text("--")
    $("#recapitulatif-horaire").text("--")
    $("#credit-sms-preview").text($("#credit-sms-after").text())
    $("#credit-email-preview").text($("#credit-email-after").text())

    $("#credit-email-after").text("--")
    $("#credit-sms-after").text("--")

    setDataPrevisualisationEmail("[Votre nom]");
    setDataPrevisualisationSms("[votre nom]")
}



function toRFC3339WithOffset(date) {
    const pad = n => String(n).padStart(2, "0");

    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";

    const hhOffset = pad(Math.floor(Math.abs(offset) / 60));
    const mmOffset = pad(Math.abs(offset) % 60);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:00` +
        `${sign}${hhOffset}:${mmOffset}`;
}


async function saveInCalendar(host, provider, dayStart, hourStart, hourEnd, title, description) {

    const [year, month, day] = dayStart.split('-').map(Number);
    const [hStart, mStart] = hourStart.split(':').map(Number);
    const [hEnd, mEnd] = hourEnd.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hStart, mStart);
    const endDate = new Date(year, month - 1, day, hEnd, mEnd);

    const dateStartRFC = toRFC3339WithOffset(startDate);
    const dateEndRFC = toRFC3339WithOffset(endDate);

    const eventData = {
        title : title,
        description : description,
        dateStart : dateStartRFC,
        dateEnd : dateEndRFC,
        allDay : false,
    }

    const saved = await fetch(`${host}/api/calendar/create`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            provider, eventData
        })
    })
    const resSaved = await saved.json();
    return resSaved
}


/* async function saveInGoogle(host, dayStart, hourStart, hourEnd, title, description) {
    const [year, month, day] = dayStart.split('-').map(Number);
    const [hStart, mStart] = hourStart.split(':').map(Number);
    const [hEnd, mEnd] = hourEnd.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hStart, mStart);
    const endDate = new Date(year, month - 1, day, hEnd, mEnd);

    const dateStartRFC = toRFC3339WithOffset(startDate);
    const dateEndRFC = toRFC3339WithOffset(endDate);


    const savedGoogle = await fetch(`${host}/api/calendar/google/create`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            summary: title,
            description,
            dateStart: dateStartRFC,
            dateEnd: dateEndRFC,
        })
    })
    const resSavedGoogle = await savedGoogle.json()
    return resSavedGoogle
}

async function saveInKlendyx(host, title, description, dayStart, hourStart, hourEnd) {

    const [year, month, day] = dayStart.split('-').map(Number);
    const [hStart, mStart] = hourStart.split(':').map(Number);
    const [hEnd, mEnd] = hourEnd.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hStart, mStart);
    const endDate = new Date(year, month - 1, day, hEnd, mEnd);

    const dateStartRFC = toRFC3339WithOffset(startDate);
    const dateEndRFC = toRFC3339WithOffset(endDate);

    const savedKlendyx = await fetch(`${host}/api/event/klendyx/create`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            summary: title,
            describe: description,
            hourStart: dateStartRFC,
            hourEnd: dateEndRFC,
        })
    })
    const resSavedKlendyx = await savedKlendyx.json()
    return resSavedKlendyx
}
 */





$("#btn-submit-rdv").on("click", async function (e) {
    e.preventDefault()
    MessageAlert.removeMessage()
    resetCss()
    const config = await getConfig()
    const host = config.host;

    const nom = $("#data-rdv-nom").val()
    const prenom = $("#data-rdv-prenom").val()
    const email = $("#data-rdv-email").val()

    const validEmail = validateEmail(email)
    let phone = $("#data-rdv-phone").val()

    const dayStart = $("#data-rdv-day-start").val()
    const hourStart = $("#data-rdv-horaire-start").val()
    const hourEnd = $("#data-rdv-horaire-end").val()

    const title = $("#data-rdv-title").val();
    const commentaire = $("#data-rdv-commentaire").val()

    const methodContactSms = $("#contact-method-sms").is(":checked")
    const methodContactEmail = $("#contact-method-email").is(":checked")

    let rappel = $("#recapitulatif-rappel").text()
    rappel === "Désactivé" ? rappel = false : rappel = true;
    const timeRappel = $("#data-rdv-hour-rappel").val()

    const creditSms = $("#credit-sms-after").text()
    const creditEmail = $("#credit-email-after").text()

    const allInputValid = controleInput(nom, prenom, email, validEmail, phone, dayStart, hourStart, hourEnd, title, methodContactSms, methodContactEmail, creditEmail, creditSms)

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





    let messageResult = ""
    // sauvegarde dans un calendar
    const googleSave = $("#external-google").is(":checked")
    const klendyxSave = $("#external-klendyx").is(":checked")
    const outlookSave = $("#external-outlook").is(":checked")
    const appleSave = $("#external-apple").is(":checked")
    const description = `Rendez-vous "${title}" avec ${nom + " " + prenom} commentaire envoyé : ${commentaire || "aucun"}`

    const provider = []


    if (googleSave) {
        provider.push("google")
    }
    if (klendyxSave) {
        provider.push("klendyx")
    }
    if (outlookSave) {
        provider.push("outlook")
    }
    if (appleSave) {
        provider.push("apple")
    }

    for (const calendar of provider){
        const saved = await saveInCalendar(host, calendar, dayStart, hourStart, hourEnd, title, description)
        messageResult += `<p>${saved.data.message}</p>`
    }
    


    //Send email/sms du rendez-vous
    const methodRdvConfirmation = $("#method-rdv-confirmation").is(":checked")
    const methodRdvProposition = $("#method-rdv-proposition").is(":checked")

    const sending = await fetch(`${host}/api/rdv/sending`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            methodRdvProposition,
            methodRdvConfirmation,
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
            rappelSms: $("#data-rdv-rappel-method-sms").is(":checked"),
            rappelEmail: $("#data-rdv-rappel-method-email").is(":checked"),
            timeRappel,
        })
    })


    //Fin du submit affichage du resultat
    scrollTo()
    const resSending = await sending.json()
    Object.entries(resSending["data"]).map(([key, value]) => {
        messageResult += `<p> ${resSending.data[key].message}</p>`
    })
    resetFormulaire()
    createClassiqueModale(`<div style="padding:10px; display:flex; flex-direction:column; gap:10px">${messageResult}</div>`)
})