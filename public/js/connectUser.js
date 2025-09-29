// Gestion de la connexion
$(document).ready(function () {


    $("#loginForm").on("submit", (e) => {
        e.preventDefault();

        //reset du message d'alerte
        $("#msg-alert").text(``)


        const email = $("#emailConnect").val();
        const mdp = $("#mdpConnect").val();

        $.ajax({
            url: "/api/user/connect",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({ emailConnect: email, mdpConnect: mdp }),
            success: function (data) {
                if (data.success == true) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "/index";
                } else {
                    $("#msg-alert").text(`${data.message}`)
                }

            },
            error: function () {
                $("#msg-alert").text(`Erreur survenue avec le serveur veuillez essayer plus tard !`)

            }
        });
    });
});