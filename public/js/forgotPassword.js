//déclachemet de la route pour la logique forgot-password by email


$("#submit-forgot-password").on("click", function (e) {
    e.preventDefault()
    const email = $("#email").val()
    console.log("debut de la route")

    $.ajax({
        url: "/api/user/email/new-password",
        method: "post",
        contentType: "application/json",
        data: JSON.stringify(
            { emailTarget: email }
        ),
        success: function (data) {
            if (data.success == true) {
                $("#message").text(`${data.message}`)
            }
        }
    })
})
