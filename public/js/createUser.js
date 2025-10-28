
//Controle des champs et fetch vers api
$(document).ready(() => {
    $("#createUserForm").on("submit", async function (e) {
        e.preventDefault()


        const scrollTo = () => window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

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
            scrollTo()
            return
        }

        if (mdp !== mdpConfirm) {
            $("#mdp").css("border", "1px solid var(--error-color)")
            $("#mdpConfirm").css("border", "1px solid var(--error-color)")
            $("#msg-alert").text(`Veuillez faire correspondre les deux mots de passes !`)
            scrollTo()
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
                console.log(res)
                if (res.success === true) {
                    $("#msg-alert").css("color", "green")
                    const message = res.message.replace(/\n/g, "<br>")
                    $("#msg-alert").html(`<p>${message}</p>`)
                    scrollTo()
                    $("#nom").val("")
                    $("#prenom").val("")
                    $("#email").val("")
                    $("#mdp").val("")
                    $("#mdpConfirm").val("")

                    $("#raisonSocial").val("")
                    $("#siren").val("")
                    $('#cgu').prop('checked', false);
                } else {
                    $("#msg-alert").text(`${res.message}`)
                    scrollTo()
                }
            },

            error: function (err) {
                $("#msg-alert").text(`Erreur survenu avec le serveur.`)
                console.log(err)
            }
        })
    })
})