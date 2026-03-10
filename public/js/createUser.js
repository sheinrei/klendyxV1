
//Controle des champs et fetch vers api
$(document).ready(() => {


    $("#login-google").on("click", function (e) {
        e.preventDefault();
        createClassiqueModale("Fonctionalité en cours de constuction")
    })

    let stateToggle = false
    $("#toggle-entreprise").on("click", function () {
        console.log("toggle")
        const imgSrc = stateToggle ? "https://img.icons8.com/color/50/circled-chevron-down.png" : "https://img.icons8.com/fluency/48/circled-chevron-up.png";
        $(this).attr("src", imgSrc);
        stateToggle = !stateToggle
        $(".entreprise-form").slideToggle(300);
    })



    $("#createUserForm").on("submit", async function (e) {
        e.preventDefault()
        MessageAlert.removeMessage()

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
            MessageAlert.create("error", "#input-message-alert", "Veuillez valider les CGU")
            scrollTo()
            return
        }

        if (mdp !== mdpConfirm) {
            $("#mdp").css("border", "1px solid var(--error-color)")
            $("#mdpConfirm").css("border", "1px solid var(--error-color)")
            MessageAlert.create("error", "#input-message-alert", "Veuillez faire correspondre les deux mots de passes")
            scrollTo()
            return
        }

        if ($("#strength-bar").val() !== 100) {
            MessageAlert.create("error", "#input-message-alert", "Mot de passe trop faible")
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
                if (res.success === true) {
                    MessageAlert.create("success", "#input-message-alert", res.message)
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
                    console.log(res)
                    MessageAlert.create("warning", "#input-message-alert", res.message)
                    scrollTo()
                }
            },

            error: function (err) {
                MessageAlert.create("error", "#input-message-alert", "Erreur survenu avec le serveur")
                console.log(err)
            }
        })
    })
})

