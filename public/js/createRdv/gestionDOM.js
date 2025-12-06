$(async function () {



    const config = await getConfig()
    const host = config.host

    const dataUser = await fetch(`${host}/api/user/data`, {
        method: "GET",
        "ContentType": "application/json"
    })
    const resUser =  await dataUser.json()
    const nameInitialisateur = resUser.nom + " " + resUser.prenom

    function setDataRecapitulatif() {
        const client = `${$("#data-rdv-nom").val() || ""} ${$("#data-rdv-prenom").val() || ""}`
        let textContact = ""
        const stateSms = document.getElementById("contact-method-sms").checked
        const stateEmail = document.getElementById("contact-method-email").checked
        if (stateEmail) textContact += "Email"
        if (stateEmail && stateSms) textContact += " - "
        if (stateSms) textContact += "SMS"

        const date = $("#data-rdv-day-start").val()

        let textHorraire = "";
        const horraireStart = $("#data-rdv-horraire-start").val()
        const horraireEnd = $("#data-rdv-horraire-end").val()
        if (horraireStart) textHorraire += horraireStart.replace(":", "h");
        if (horraireStart && horraireEnd) textHorraire += " à "
        if (horraireEnd) textHorraire += horraireEnd.replace(":", "h")

        const title = $("#data-rdv-title").val()
        let timeRappel;
        stateToggleRappel ? timeRappel = `${$("#data-rdv-hour-rappel").val()} heures avant` : "Désactivé"



        $("#recapitulatif-client").text(client || "--")
        $("#recapitulatif-method-contact").text(textContact || "--")
        $("#recapitulatif-date").text(date || "--")
        $("#recapitulatif-horraire").text(textHorraire || "--")
        $("#recapitulatif-titre").text(title)
        $("#recapitulatif-rappel").text(timeRappel || "Désactivé")
    }

    function setDataPrevisualisationEmail() {

        const email = $("#data-rdv-email").val();
        const prenom = $("#data-rdv-prenom").val();
        const title = $("#data-rdv-title").val();
        const dateDebut = $("#data-rdv-day-start").val();
        const hourStart = $("#data-rdv-horraire-start").val();
        const hourEnd = $("#data-rdv-horraire-end").val();
        const hour = `${hourStart} - ${hourEnd}`;
        const infoSupp = $("#data-rdv-commentaire").val()


        $("#previsualisation-email-name").text(prenom || "[Prénom]")
        $("#previsualisation-email-title").text(title || "[Titre]")
        $("#previsualisation-email-email").text(email || "[Email]")
        $("#previsualisation-email-date-start").text(dateDebut || "[Date de début]")
        $("#previsualisation-email-hour").text(hour || "[Heure] - [Heure]")
        $("#previsualisation-email-name-initialisateur").text(nameInitialisateur || "[Votre nom]")
        if (infoSupp) $("#previsualisation-email-information-complementaire").text(`Information complémentaire : ${infoSupp}`)

    }

    function setDataPrevisualisationSms() {
        const title = $("#data-rdv-title").val();
        const dateDebut = $("#data-rdv-day-start").val();

        const hourStart = $("#data-rdv-horraire-start").val();
        const hourEnd = $("#data-rdv-horraire-end").val();
        const horraire = hourStart && hourEnd ? `${hourStart.replace(":", "h")} a ${hourEnd.replace(":", "h")}` : "[Heure] à [Heure]"

        $("#previsualisation-phone-title").text(title || "[Titre]")
        $("#previsualisation-phone-name").text(nameInitialisateur)
        $("#previsualisation-phone-date").text(dateDebut || "[Date]")
        $("#previsualisation-phone-horraire").text(horraire || "[Heure] à [Heure]")
    }


    // Checkbox Email
    $("#contact-method-email").on("change", function () {
        const stateMethodEmail = this.checked;
        $(this).closest("label").toggleClass("label-selected", stateMethodEmail);
        $(this).closest("svg").toggleClass("svg-selected", stateMethodEmail);
        !stateMethodEmail ? $("#previsualisation-email").css("display", "none") : $("#previsualisation-email").css("display", "flex");

        if (stateMethodEmail) {
            setDataPrevisualisationEmail()
        }
    });


    // Checkbox SMS
    $("#contact-method-sms").on("change", function () {
        const stateMethodSms = this.checked;
        $(this).closest("label").toggleClass("label-selected", stateMethodSms);
        $(this).siblings("svg").toggleClass("svg-selected", stateMethodSms);
        !stateMethodSms ? $("#previsualisation-sms").css("display", "none") : $("#previsualisation-sms").css("display", "flex")

        if (stateMethodSms) {
            setDataPrevisualisationSms()
        }
    });


    //toggle de rappel rdv
    let stateToggleRappel = false;
    $("#btn-toggle-switch-rappel").on("click", function (e) {
        e.preventDefault();

        stateToggleRappel ? $(this).removeClass("btn-toggle-switch-activ").addClass("btn-toggle-switch-desactiv") : $(this).removeClass("btn-toggle-switch-desactiv").addClass("btn-toggle-switch-activ")

        stateToggleRappel ? $(".frame-setup-rappel").css("display", "none") : $(".frame-setup-rappel").css("display", "flex");

        stateToggleRappel = !stateToggleRappel
        setDataRecapitulatif()
    })



    $("input").on("input", function () {
        setDataRecapitulatif()
        setDataPrevisualisationEmail();
        setDataPrevisualisationSms()
    })

})