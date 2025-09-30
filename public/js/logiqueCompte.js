const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/index"
} else {
    $.ajax({
        url: "/api/user/data",
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
        url: "/api/user/connected/reset-password",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-type": "application/json"
        },
        data: JSON.stringify({
            lastPassword,
            newPassword,
        }),
        success: function (data) {
            if (data.success == true) {
                $("#return-message").text(`${data.message}`)
            } else {
                $("#return-message").text(`${data.message}`)
            }
        },
        error: function (err) {
            console.log(err)
            $("#return-message").text(`Une erreur est survenu et nous n'avons pas pu modifier votre mot de passe, veuillez essayer plus tard.`)
        }
    })
})
