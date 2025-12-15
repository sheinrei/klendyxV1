// Gestion de la connexion
$(document).ready(function () {


    $("#loginForm").on("submit", async (e) => {
        e.preventDefault();

        const config = await getConfig()
        const host = config.host

        //reset du message d'alerte
        MessageAlert.removeMessage()


        const email = $("#emailConnect").val();
        const mdp = $("#mdpConnect").val();

        $.ajax({
            url: `${host}/api/user/connect`,
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({ emailConnect: email, mdpConnect: mdp }),

            success: function (data) {
                if (data.success == true) {
                    const redirect = window.localStorage.getItem("redirect")
                    if (redirect) {
                        window.location.href = redirect
                        localStorage.removeItem("redirect")
                    } else {
                        window.location.href = "/dashboard"
                    }
                } else {
                    MessageAlert.create("error","#input-message-alert",`${data.message}`)
                }

            },
            error: function () {
                $("#msg-alert").text(`Erreur survenue avec le serveur veuillez essayer plus tard !`)

            }
        });
    });
});