//déclachemet de la route pour la logique forgot-password by email


$("#submit-forgot-password").on("click",async function (e) {
    e.preventDefault()
    const email = $("#email").val()

    const config = await getConfig()
    const host = config.host

    $.ajax({
        url: `${host}/api/user/email/new-password`,
        method: "post",
        contentType: "application/json",
        data: JSON.stringify(
            { emailTarget: email }
        ),
        success: function (data) {
            if (data.success == true) {
                $("#message-alert-success").text(`${data.message}`).css("display", "block")
            }
        }
    })
})
