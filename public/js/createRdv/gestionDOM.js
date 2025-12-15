function setDataRecapitulatif(stateToggleRappel) {
    const client = `${$("#data-rdv-nom").val() || ""} ${$("#data-rdv-prenom").val() || ""}`
    let textContact = ""
    const stateSms = document.getElementById("contact-method-sms").checked
    const stateEmail = document.getElementById("contact-method-email").checked
    if (stateEmail) textContact += "Email"
    if (stateEmail && stateSms) textContact += " - "
    if (stateSms) textContact += "SMS"

    let date = parseDateToFr($("#data-rdv-day-start").val())
    if (date === "[Date]") date = "--"


    let textHorraire = "";
    const horraireStart = $("#data-rdv-horraire-start").val()
    const horraireEnd = $("#data-rdv-horraire-end").val()
    if (horraireStart) textHorraire += horraireStart.replace(":", "h");
    if (horraireStart && horraireEnd) textHorraire += " à "
    if (horraireEnd) textHorraire += horraireEnd.replace(":", "h")

    const title = $("#data-rdv-title").val()
    let timeRappel;
    stateToggleRappel ? timeRappel = `${$("#data-rdv-hour-rappel").val()} heures avant` : "Désactivé"

    const methodRdvChecked = $("#method-rdv-confirmation").is(":checked")
    const methodRdv = methodRdvChecked ? "Confirmation" : "Proposition"
    $("#recapitulatif-method-rdv").text(methodRdv)

    $("#recapitulatif-client").text(client || "--")
    $("#recapitulatif-method-contact").text(textContact || "--")
    $("#recapitulatif-date").text(date)
    $("#recapitulatif-horraire").text(textHorraire || "--")
    $("#recapitulatif-titre").text(title)
    $("#recapitulatif-rappel").text(timeRappel || "Désactivé")


    const rappelMethodSms = $("#data-rdv-rappel-method-sms").is(":checked")
    const rappelMethodEmail = $("#data-rdv-rappel-method-email").is(":checked")
    let creditSmsAfter = $("#credit-sms-preview").text()
    if (stateSms) creditSmsAfter--
    if (rappelMethodSms && stateToggleRappel) creditSmsAfter--

    let creditEmailAfter = $("#credit-email-preview").text()
    if (stateEmail) creditEmailAfter--
    if (rappelMethodEmail && stateToggleRappel) creditEmailAfter--

    if (creditSmsAfter <= 0) $("#credit-sms-after").css("color", "var(--warning-color)")
    if (creditEmailAfter <= 0) $("#credit-email-after").css("color", "var(--warning-color)")
    $("#credit-sms-after").text(creditSmsAfter)
    $("#credit-email-after").text(creditEmailAfter)
}


function setDataPrevisualisationEmail(nameInitialisateur) {

    const email = $("#data-rdv-email").val();
    const prenom = $("#data-rdv-prenom").val();
    const title = $("#data-rdv-title").val();
    const dateDebut = $("#data-rdv-day-start").val();
    const hourStart = $("#data-rdv-horraire-start").val();
    const hourEnd = $("#data-rdv-horraire-end").val();
    const hour = `${hourStart} - ${hourEnd}`;
    const commentaire = $("#data-rdv-commentaire").val()


    $("#email-objet").text(`Votre rendez-vous avec ${nameInitialisateur || "[Votre nom]"}`)
    $("#previsualisation-email-name").text(prenom || "[Prénom]")
    $("#previsualisation-email-email").text(email || "[Email]")
    $("#previsualisation-email-date-start").text(parseDateToFr(dateDebut) || "[Date de début]")
    $("#previsualisation-email-hour").text(hour || "[Heure] - [Heure]")
    $("#previsualisation-email-name-initialisateur").text(nameInitialisateur || "[Votre nom]")
    commentaire
        ? $("#previsualisation-email-information-complementaire").text(`Information complémentaire : ${commentaire}`)
        : $("#previsualisation-email-information-complementaire").text("")

    const methodRdvConfirmation = $("#method-rdv-confirmation").is(":checked");
    const methodRdvProposition = $("#method-rdv-proposition").is(":checked");



    if (methodRdvProposition) {
        $("#email-content-header").text(`${nameInitialisateur || "[Votre nom]"} vous propose un rendez vous "${title || "[Titre]"}"`)
        const textProposition = `Merci de renseigner votre réponse en cliquant sur le bouton ci dessous`
        const btnProposition = `    <button style="
                                        padding: 5px 10px;
                                        background: linear-gradient(to right, rgba(113,106,249,1) 0%, rgba(91,9,121,1) 100%);
                                        border-radius: 7px;
                                        color: white;
                                        border: none;
                                        position:relative;
                                        left:50%;
                                        transform:translateX(-50%);
                                        ">Répondre</button>`
        $("#input-text-proposition").text(textProposition)
        $("#input-btn-proposition").html(btnProposition)
    };

    if (methodRdvConfirmation) {
        $("#email-content-header").text(`Nous vous confirmons votre rendez-vous "${title || "[Titre]"}" avec ${nameInitialisateur}`)
        $("#input-text-proposition").text("")
        $("#input-btn-proposition").html("")
    }

}

function parseDateToFr(date) {
    if (!date) return "[Date]"
    const objetDate = new Date(date.replace(":", "-"))
    dateParsed = objetDate.toLocaleDateString("FR-fr", { day: "numeric", month: "long", year: "numeric" })
    return dateParsed
}

function setDataPrevisualisationSms(nameInitialisateur) {

    const title = $("#data-rdv-title").val() || "[Titre]";
    const dateDebut = parseDateToFr($("#data-rdv-day-start").val());
    const hourStart = $("#data-rdv-horraire-start").val();
    const hourEnd = $("#data-rdv-horraire-end").val();
    const horraire = hourStart && hourEnd ? `${hourStart.replace(":", "h")} a ${hourEnd.replace(":", "h")}` : "[Heure] à [Heure]"

    const methodConfirmation = $("#method-rdv-confirmation").is(":checked")
    const methodProposition = $("#method-rdv-proposition").is(":checked")
    let text = ""
    if (methodConfirmation) text = `Bonjour, votre rendez-vous "${title}" avec ${nameInitialisateur} est confirmé le ${dateDebut} de ${horraire}
    `
    if (methodProposition) text = `Bonjour, ${nameInitialisateur} vous propose un rendez-vous "${title}" le ${dateDebut} de ${horraire}. Merci de le confirmer en cliquant sur ce lien : klendyx.com
    `
    $("#sms-count-length").text(text.length)
    $("#previsualisation-phone-body-sms").text(text)

}

async function setCredit(host) {
    const getCurrentCredit = await fetch(`${host}/api/credit/get`, {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    })
    const resCurrentCredit = await getCurrentCredit.json()
    const currentSms = resCurrentCredit.data.sms
    const currentEmail = resCurrentCredit.data.mail
    $("#credit-sms-preview").text(currentSms)
    $("#credit-email-preview").text(currentEmail)
}

async function checkCalendarSync(host) {
    const googleSync = await fetch(`${host}/api/calendar/google/sync`, {
        method: "GET",
        "Content-type": "application/json"
    })
    const google = await googleSync.json()
    const apple = false;
    const outlook = false;

    if (!google.success) {
        $("#external-calendar-save-google").remove()
    }
    if (!apple) {
        $("#external-calendar-save-apple").remove()
    }
    if (!outlook) {
        $("#external-calendar-save-outlook").remove()
    }
}





$(async function () {
    const config = await getConfig()
    const host = config.host

    const dataUser = await fetch(`${host}/api/user/data`, {
        method: "GET",
        "ContentType": "application/json"
    })
    const resUser = await dataUser.json()
    const nameInitialisateur = resUser.nom + " " + resUser.prenom;

    setCredit(host)
    checkCalendarSync(host)





    // Checkbox Email
    $("#contact-method-email").on("change", function () {
        const stateMethodEmail = this.checked;
        $(this).closest("label").toggleClass("label-selected", stateMethodEmail);
        $(this).closest("svg").toggleClass("svg-selected", stateMethodEmail);
        !stateMethodEmail ? $("#previsualisation-email").css("display", "none") : $("#previsualisation-email").css("display", "flex");

        if (stateMethodEmail) {
            setDataRecapitulatif(stateToggleRappel)
        }
    });


    // Checkbox SMS
    $("#contact-method-sms").on("change", function () {
        const stateMethodSms = this.checked;
        $(this).closest("label").toggleClass("label-selected", stateMethodSms);
        $(this).siblings("svg").toggleClass("svg-selected", stateMethodSms);
        !stateMethodSms ? $("#previsualisation-sms").css("display", "none") : $("#previsualisation-sms").css("display", "flex")

        if (stateMethodSms) {
            setDataRecapitulatif(stateToggleRappel)
        }
    });


    //toggle de rappel rdv
    let stateToggleRappel = false;
    $("#btn-toggle-switch-rappel").on("click", function (e) {
        e.preventDefault();
        $(".frame-setup-rappel").toggle(300)
        stateToggleRappel ? $(this).removeClass("btn-toggle-switch-activ").addClass("btn-toggle-switch-desactiv") : $(this).removeClass("btn-toggle-switch-desactiv").addClass("btn-toggle-switch-activ")

        stateToggleRappel = !stateToggleRappel
        setDataRecapitulatif(stateToggleRappel)
    })


    //mis à jour de la data 
    $("input").on("input", function () {
        setDataRecapitulatif(stateToggleRappel)
        setDataPrevisualisationEmail(nameInitialisateur);
        setDataPrevisualisationSms(nameInitialisateur)
    })

    $("textarea").on("input", function () {
        setDataPrevisualisationEmail(nameInitialisateur);
    })



    //switch retirer les frames selon la methode du rendez-vous
    $("#method-rdv-proposition").on("input", function () {
        $("#frame-rappel").css("display", "none")
        $("#frame-sync-calendar").css("display", "none")
    })

    $("#method-rdv-confirmation").on("input", function () {
        $("#frame-rappel").css("display", "block");
        $("#frame-sync-calendar").css("display", "block")
    })


})