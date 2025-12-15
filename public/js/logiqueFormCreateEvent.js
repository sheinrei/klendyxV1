// Logique du formulaire de création d'un rdv avec l'affiche du render//
//A supprimer???
$("#btn-submit-form-create-event").on("click", async function (e) {
    e.preventDefault();
    const htmlMessageAlert = $("#message-alert")
    $(htmlMessageAlert).text("");


    const checkedEmail = $("#type-email").is(":checked")
    const checkedSms = $("#type-sms").is(":checked")

    const recipientContactEmail = $("#client-email").val();
    let recipientContactSms = $("#client-phone").val()

    const dateDebut = $("#date-debut").val();
    const dateFin = $("#date-fin").val();

    const recipientName = $("#client-nom").val() + " " + $("#client-prenom").val();

    const titleEvent = $("#title-event").val();
    const messageEvent = $("#message-event").val();

    let plateformSender = [];

    if (!checkedEmail && !checkedSms) {
        $(htmlMessageAlert).text("Veuillez saisir au moins une methode d'envoie.")
        return
    }

    if (dateDebut > dateFin) {
        $(htmlMessageAlert).text("La date du début du rendez-vous ne pas être après la fin de celle-ci")
        return
    }




    if (checkedEmail) {
        plateformSender.push("email")
    }
    if (checkedSms) {
        const formatSms = parseSmsNumber(recipientContactSms);
        if (!formatSms.success) {
            $(htmlMessageAlert).text(formatSms.message);
            return
        }
        recipientContactSms = formatSms.phone
        plateformSender.push("sms")
    }


    //fetch notre api
    const token = localStorage.getItem("token");
    
    const config = await getConfig()
    const host = config.host
    $.ajax({
        url: `${host}/api/rdv/create`,
        method: "post",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        },

        contentType: "application/json",
        data: JSON.stringify({
            recipientName,
            plateformSender,
            recipientContactEmail,
            recipientContactSms,
            dateDebut,
            dateFin,
            titleEvent,
            messageEvent,
        }),

        success: function (res) {
            $("#form-declanch-rdv").find("input, select").val("");
            $("#form-declanch-rdv").find("input[type=checkbox]").prop("checked", false);
            $("#message-alert").text(`${res.message}`)
        },

        error: function () {
            $("#message-alert").text(`Erreur survenu avec le serveur.`)
        }
    })
})




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



