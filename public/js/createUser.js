
//Controle des champs et fetch vers api
$(document).ready(()=> {
    $("#createUserForm").on("submit", async function (e) {
        e.preventDefault()

        const nom = $("#nom").val()
        const prenom = $("#prenom").val()
        const email = $("#email").val()
        const mdp = $("#mdp").val()
        const mdpConfirm = $("#mdpConfirm").val()

        const raisonSocial = $("#raisonSocial").val()
        const siren = $("#siren").val()
        const cgu = $("#cgu").is(":checked")

        if (!cgu) {
            $("#msg-alert").text(`Veuillez valider les CGU`)
            return
        }

        if (mdp !== mdpConfirm) {
            $("#mdp").css("border", "1px solid var(--error-color)")
            $("#mdpConfirm").css("border", "1px solid var(--error-color)")
            $("#msg-alert").text(`Veuillez faire correspondre les deux mots de passes !`)
            return
        }

        const config = await getConfig()
        const host = config.host

        $.ajax({
            url: `${host}/api/user/create`,
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                nom,
                prenom,
                email,
                mdp,
                mdpConfirm,
                raisonSocial,
                siren,
            }),

            success: function (res) {
                if (res.success) {
                    //faire redirection plus confirmation par email page d'attente
                    $(".auth-subtitle").append(`<p style="color:green">Votre compte a été créé avec succes.</p>`)
                } else {
                    $("#msg-alert").text(`${res.message}`)
                }
            },

            error: function (err) {
                $("#msg-alert").text(`Erreur survenu avec le serveur.`)
                console.log(err)
            }
        })
    })
})