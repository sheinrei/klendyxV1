async function initConfigUser() {
    const token = localStorage.getItem("token");

    const config = await getConfig()
    const host = config.host


    $.ajax({
        url: `${host}/api/user/data`,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function (data) {
            $("#prenom").text(`Prenom : ${data.prenom}`)
            $("#nom").text(`Nom : ${data.nom}`)
            $("#email").text(`Email : ${data.email}`)
            $("#date-crea").text(`Date de création : ${data.created.split("T")[0]}`)
            $("#raison-social").text(`Raison social : ${data.raisonSocial || "Non renseigné"}`)
            $("#siren").text(`Siren : ${data.siren || "Non renseigné"}`)
        }

    })
}


//Changemenent de mdp
$("#submit-change-password").on("click", function (e) {
    e.preventDefault();
    $("#return-message").text("");

    const lastPassword = $("#last-password").val();
    const newPassword = $("#new-password").val();


    $.ajax({
        url: `${host}/api/user/connected/reset-password`,
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        },
         xhrFields: {
            withCredentials: true
        }, 
        data: JSON.stringify({
            lastPassword,
            newPassword,
        }),
        success: function (data) {
            if (data.success == true) {
                $("#message-alert-password").text(`${data.message}`)
            } else {
                $("#message-alert-password").text(`${data.message}`)
            }
        },
        error: function (err) {
            $("#message-alert-password").text(`Une erreur est survenu et nous n'avons pas pu modifier votre mot de passe, veuillez essayer plus tard.`)
        }
    })
})

//synchroniser les calendar

$("#btn-sync-google").on('click', async function (e) {
    e.preventDefault();

    const config = await getConfig()
    const host = config.host
    window.location.href = `${host}/api/calendar/auth`

})



initConfigUser()