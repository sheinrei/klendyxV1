async function getDataUser(host) {
    const data = await fetch(`${host}/api/user/data`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const res = await data.json()
    return res
}

function hydrateDataUser(data) {
    const fullName = `${firstToUpper(data.nom)} ${firstToUpper(data.prenom)}`
    const textCreated = `Membre depuis le ${dateToFr(data.created)}`

    $("#top-card-user-name").text(fullName);
    $("#top-card-user-email").text(data.email);
    $("#top-card-user-date-create").text(textCreated);
    $(".logo-name").text(`${data.nom[0].toUpperCase()}${data.prenom[0].toUpperCase()}`);


    $("#new-user-last-name").prop("placeholder", firstToUpper(data.nom));
    $("#new-user-first-name").prop("placeholder", firstToUpper(data.prenom));
    $("#new-user-email").prop("placeholder", data.email);

    $("#user-enterprise-raison-social").prop("placeholder", data.raisonSocial || "Non renseigné");
    $("#user-enterprise-siren").prop("placeholder", data.siren || "Non renseigné");

    if (data.siren || data.raisonSocial) {
        $("#user-enterprise-toggle").prop("checked", true)
    }

    if (!data.raisonSocial && !data.siren) {
        $("#frame-enterprise").hide()
    }
}

async function hydrateStateSyncCalendar(host) {

    const data = await checkCalendarSync(host);

    $("#state-sync-google").text(data.google.sync ? `✅ Synchronisé depuis le ${dateToFr(data.google.createdAt)}` : " ❌ Non synchronisé")
    $("#state-sync-outlook").text(data.outlook.sync ? `✅ Synchronisé depuis le ${dateToFr(data.outlook.createdAt)}` : "❌ Non synchronisé")
    $("#state-sync-apple").text(data.apple.sync ? `✅ Synchronisé depuis le ${dateToFr(data.apple.createdAt)}` : " ❌ Non synchronisé")

    $("#action-sync-google").text(data.google.sync ? "Révoquer" : "Synchroniser")
    $("#action-sync-outlook").text(data.outlook.sync ? "Révoquer" : "Synchroniser")
    $("#action-sync-apple").text(data.apple.sync ? "Révoquer" : "Synchroniser")

    console.log(data.outlook.sync)

    data.google.sync
        ? $("#action-sync-google").addClass("btn-revok-calendar")
        : $("#action-sync-google").removeClass("btn-revok-calendar")

    data.outlook.sync
        ? $("#action-sync-outlook").addClass("btn-revok-calendar")
        : $("#action-sync-outlook").removeClass("btn-revok-calendar")

    data.apple.sync
        ? $("#action-sync-apple").addClass("btn-revok-calendar")
        : $("#action-sync-apple").removeClass("btn-revok-calendar")
}

async function updateDataUser(host, data) {
    const update = await fetch(`${host}/api/user/update`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            data
        })
    })
    const res = await update.json()
    return res
}

async function setUserPreference(host) {
    const res = await fetch(`${host}/api/userPreference/get`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    $("#user-2FA").prop("checked", data.data.doubleAuth);
    $("#user-notification-email").prop("checked", data.data.emailNotification);
}

async function setAbbonement(host) {
    const res = await fetch(`${host}/api/credit/get`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json();
    const textDataRefresh = `${dateToFr(data.data.refreshAt.split(" ")[0])} à ${data.data.refreshAt.split(" ")[1].replace(":", "h").slice(0, 3)}00`

    $("#user-plan").text(`Votre abbonnement : ${data.data.plan}`)

    $("#user-credit-sms").text(data.data.sms)
    $("#user-credit-email").text(data.data.mail)
    $("#user-date-refresh-credit").text(textDataRefresh)
}

async function revokeCalendar(host, provider) {


    const revoked = await fetch(`${host}/api/calendar/revoke-sync`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            provider
        })
    })

    const data = await revoked.json();
    return {
        success: data.success,
        message: data.message,
    }
}






$(async () => {


    const config = await getConfig()
    const host = config.host

    const dataUser = await getDataUser(host);

    hydrateDataUser(dataUser)
    hydrateStateSyncCalendar(host)
    setUserPreference(host)
    setAbbonement(host)
    const redirect = window.localStorage.getItem("redirect")
    if (redirect) window.localStorage.removeItem("redirect")





    //=== eventListener ===
    //param general
    //update nom/prenom
    $("#btn-update-name").on("click", async function (e) {
        e.preventDefault()

        const firstName = $("#new-user-first-name").val() || dataUser.prenom;
        const lastName = $("#new-user-last-name").val() || dataUser.nom;
        const data = {
            nom: lastName,
            prenom: firstName,
        };

        const update = await updateDataUser(host, data)
        MessageAlert.create(update.success ? "information" : "warning",
            "#input-message-alert-general",
            update.message
        )
        if (update.success) {
            $("#new-user-first-name").prop("placeholder", firstName).val("");
            $("#new-user-last-name").prop("placeholder", lastName).val("")
        }
    })

    //updateEmail
    $("#btn-update-email").on("click", async function (e) {
        e.preventDefault()

        const email = $("#new-user-email").val()
        const valide = validateEmail(email)

        const checking = [
            { condition: !email, message: "Veuillez saisir une adresse e-mail" },
            { condition: !valide, message: "Veuillez saisir une adresse e-mail valide" },
            { condition: email === dataUser.email, message: "Veuillez renseigner un nouvel e-mail avant de soumettre" }
        ]

        for (const rule of checking) {
            if (rule.condition) {
                return MessageAlert.create("warning", "#input-message-alert-general", rule.message);
            }
        }

        const update = await updateDataUser(host, { email })
        MessageAlert.create(update.success ? "information" : "warning",
            "#input-message-alert-general",
            update.message
        )

        if (update.success) {
            $("#new-user-email").prop("placeholder", email).val("")
        }

    })

    //gestion DOM password
    let stateShowLastPassword = false
    let stateShowNewPassword = false
    let stateShowNewPasswordConfirm = false

    $("#show-input-user-last-password").on("click", () => {
        $("#last-password").prop("type", stateShowLastPassword ? "password" : "text")
        stateShowLastPassword = !stateShowLastPassword
    })

    $("#show-input-user-new-password").on("click", () => {
        $("#new-password").prop("type", stateShowNewPassword ? "password" : "text")
        stateShowNewPassword = !stateShowNewPassword
    })

    $("#show-input-user-new-password-confirm").on("click", () => {
        $("#new-password-confirm").prop("type", stateShowNewPasswordConfirm ? "password" : "text")
        stateShowNewPasswordConfirm = !stateShowNewPasswordConfirm
    })


    $("#new-password").on("input", function () {
        const password = $(this).val()
        const ProgressBar = new ProgressBarPassword("progress-bar-password", "input-message-alert-password", password)
        ProgressBar.update().show()

    })

    //update password
    $("#btn-update-password").on("click", async function (e) {
        e.preventDefault();
        MessageAlert.removeMessage()
        const lastPassword = $("#last-password").val();
        const newPassword = $("#new-password").val();
        const newPasswordConfirm = $("#new-password-confirm").val()
        const progressBarValue = $("progress").val()
        const condition = [
            { condition: newPassword != newPasswordConfirm, message: "Les deux nouveaux mots de passes ne correspondent pas" },
            { condition: lastPassword.length < 1, message: "Veuillez saisir votre ancien mot de passe" },
            { condition: newPassword.length < 1, message: "Veuillez saisir le nouveau mot de passe" },
            { condition: newPasswordConfirm.length < 1, message: "Veuillez saisir la confirmation du nouveau mot de passe" },
            { condition: progressBarValue < 100, message: "Veuillez saisir un nouveau mot de passe plus robuste" }
        ]

        for (const rule of condition) {
            if (rule.condition) {
                return MessageAlert.create("warning", "#input-message-alert-password", rule.message)
            }
        }

        const reset = await fetch(`${host}/api/user/connected/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lastPassword,
                newPassword
            })
        })
        const res = await reset.json();
        console.log(res)
        MessageAlert.create(res.success ? "success" : "warning", "#input-message-alert-password", res.message)
        if (res.success) {
            $("#last-password").val("")
            $("#new-password").val("")
            $("#new-password-confirm").val("")
        }
    })

    //enterprise
    //toggle
    $("#user-enterprise-toggle").on("click", function () {
        $("#frame-enterprise").toggle(300)
    })

    //update enterprise
    $("#user-enterprise-update").on("click", async function (e) {
        e.preventDefault();
        const raisonSocial = $("#user-enterprise-raison-social").val();
        const siren = $("#user-enterprise-siren").val();

        const data = {
            raisonSocial,
            siren
        }

        const update = await updateDataUser(host, data)
        $("#user-enterprise-raison-social").val(raisonSocial)
        $("#user-enterprise-siren").val(siren)
        MessageAlert.create(update.success ? "success" : "warning", "#message-alert-enterprise", update.message)

    })

    //Préférence notification email
    $("#user-notification-email").on("change", async function () {
        const state = $(this).is(":checked");
        const res = await fetch(`${host}/api/userPreference/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    emailNotification: state,
                }
            })
        })
        const data = await res.json();
        console.log(data)
    })


    // === Sécurité ===
    //Préférence 2FA
    $("#user-2FA").on("change", async function () {
        const state = $(this).is(":checked");
        const res = await fetch(`${host}/api/userPreference/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    doubleAuth: state
                }
            })
        })
        const resJson = await res.json();
        console.log(resJson)
    })

    $("#btn-export-data-user").on("click", function (e) {
        e.preventDefault();

        window.location.href = "/api/user/export-data"
    })

    $("#btn-get-invoice").on("click", function (e) {
        e.preventDefault();
        createClassiqueModale("Cette fonctionalité n'est pas encore implémenté")
    })


    // === gestion bouton sync des calendar ===
    $("#action-sync-google").on("click", async function (e) {
        e.preventDefault();
        switch ($(this).text()) {
            case "Révoquer":
                const revoke = await revokeCalendar(host, "google");
                MessageAlert.create(revoke.success ? "information" : "warning", "#input-message-alert-calendar", revoke.message)
                hydrateStateSyncCalendar(host)
                break;

            case "Synchroniser":
                window.localStorage.setItem("redirect", "/mon-compte")
                window.location.href = `${host}/api/calendar/google/auth`
                break;
            default:
                return;
        }
    })

    $("#action-sync-apple").on("click", async function (e) {
        e.preventDefault();
        switch ($(this).text()) {
            case "Révoquer":
                const revoke = await revokeCalendar(host, "apple");
                revoke.success ? MessageAlert.create("information", "#input-message-alert-calendar", revoke.message)
                    : MessageAlert.create("warning", "#input-message-alert-calendar", revoke.message)
                hydrateStateSyncCalendar(host)
                break;

            case "Synchroniser":
                window.location.href = `${host}/auth-icloud`
                break;
            default:
                return;
        }
    })

    $("#action-sync-outlook").on("click", async function (e) {
        e.preventDefault();
        switch ($(this).text()) {

            case "Révoquer":
                const revoke = await revokeCalendar(host, "outlook");
                MessageAlert.create(revoke.success ? "information" : "warning", "#input-message-alert-calendar", revoke.message)
                hydrateStateSyncCalendar(host)
                break;

            case "Synchroniser":
                window.localStorage.setItem("redirect", "/mon-compte")
                window.location.href = `${host}/api/calendar/outlook/auth`
                break;

            default:
                return;
        }
    })



    // === irreversible === 
    //ouvre la modale pour confirmation
    $("#btn-delete-user").on("click", async function (e) {
        e.preventDefault();
        createClassiqueModale("<p id='message-modale'>Attention vous êtes sur le point de supprimer votre compte</p>")
        $(".classique-modale-footer").append("<button class='btn-primary' id='btn-confirm-delete'>Confirmer</button>")
    })

    //Déclanche l'envoie du mail début de delete complet
    $(document).on("click", "#btn-confirm-delete", async function (e) {
        e.preventDefault();
        console.log("delete")
        const sendDelete = await fetch(`${host}/api/user/send-delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resSend = await sendDelete.json()
        if (resSend.success) {
            $("#btn-confirm-delete").remove();
            $("#message-modale").text(resSend.message)
        }
    })
})