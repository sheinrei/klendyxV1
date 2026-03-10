// Gestion de la connexion
$(document).ready(async function () {

    const config = await getConfig()
    const host = config.host

    $("#loginForm").on("submit", async (e) => {
        e.preventDefault();


        //reset du message d'alerte
        MessageAlert.removeMessage()


        const email = $("#emailConnect").val();
        const mdp = $("#mdpConnect").val();




        $.ajax({
            url: `${host}/api/user/connect`,
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                emailConnect: email,
                mdpConnect: mdp
            }),

            success: function (data) {
                if (data["2FA"]) {
                    
                    const html = `<div class="frame-2FA">
                    <div class="header-2FA">
                        <p style="font-size:18px"><strong>Vérification en deux étapes</strong></p>
                        <p>Entrez le code à 6 chiffres que nous venons de vous envoyer par email</p>
                    </div>
                        <form class="form-2FA">
                            <input type="hidden" value="${data.id}" id="input-id" />
                            <input type="text" class="input-2FA" id="input-2FA-1" maxlength="1" inputmode="numeric pattern="[0-9]*"/>
                            <input type="text" class="input-2FA" id="input-2FA-2" maxlength="1" inputmode="numeric pattern="[0-9]*"/>
                            <input type="text" class="input-2FA" id="input-2FA-3" maxlength="1" inputmode="numeric pattern="[0-9]*"/>
                            <input type="text" class="input-2FA" id="input-2FA-4" maxlength="1" inputmode="numeric pattern="[0-9]*"/>
                            <input type="text" class="input-2FA" id="input-2FA-5" maxlength="1" inputmode="numeric pattern="[0-9]*"/>
                            <input type="text" class="input-2FA" id="input-2FA-6" maxlength="1" inputmode="numeric pattern="[0-9]*"/>
                        </form>
                        <button class="btn btn-primary" id="btn-submit-2FA">Valider</button>

                    </div>`

                    $("#loginForm").remove();
                    $("#login-tab").append(html)

                    return
                }


                if (data.success == true) {

                    const redirect = window.localStorage.getItem("redirect")
                    if (redirect) {
                        window.location.href = redirect
                        localStorage.removeItem("redirect")
                    } else {
                        window.location.href = "/dashboard"
                    }

                } else {
                    MessageAlert.create("error", "#input-message-alert", `${data.message}`)
                }

            },
            error: function () {
                $("#msg-alert").text(`Erreur survenue avec le serveur veuillez essayer plus tard !`)

            }
        });
    });


    $("body").on("click", "#btn-submit-2FA", async function (e) {
        e.preventDefault()

        let code = "";
        const userId = $("#input-id").val()


        for (let i = 1; i < 7; i++) {
            code += $(`#input-2FA-${i}`).val()
        }

        console.log(code);
        const submit = await fetch(`${host}/api/user/auth-2FA`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                code,
                userId,
            })
        })

        const resSubmit = await submit.json();
        if (resSubmit.success) {
            window.location.href = "/dashboard"
        }
        console.log(resSubmit)
    })

    //gestion UX des input 2FA pour C/C
    for (let i = 1; i < 7; i++) {
        $("body").on("input", `#input-2FA-${i}`, function () {
            if ($(`#input-2FA-${i}`).val()) {
                $(`#input-2FA-${i + 1}`).focus().select()
            }
        })
    }

    $("body").on("paste", "#input-2FA-1", function (e) {

        e.preventDefault()
        const clipboard = e.originalEvent.clipboardData;
        if (!clipboard) return;
        const text = clipboard.getData("text");
        for (let i = 1; i < 7; i++) {
            $(`#input-2FA-${i}`).val(text[i - 1])
        }
        $("#btn-submit-2FA").click()
    })

});