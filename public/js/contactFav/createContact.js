
const addContactDOM = (id, nom, prenom, email, phone) => {
    const html = `
                <div id="contact-${id}" class="contact-row">
                    <p id="contact-nom-${id}"></p>
                    <p id="contact-prenom-${id}"></p>
                    <p id="contact-email-${id}"></p>
                    <p id="contact-phone-${id}"></p>

                    <div>
                        <button id="btn-delete">Supprimer</button>
                        <button id="btn-update">Modifier</button>
                    </div>
                </div>`

    $("#frame-list-contact").append(html)

    $(`#contact-nom-${id}`).text(nom)
    $(`#contact-prenom-${id}`).text(prenom)
    $(`#contact-email-${id}`).text(email)
    $(`#contact-phone-${id}`).text(phone)

}

$("#btn-create-submit").on("click", async (e) => {
    e.preventDefault()
    const config = await getConfig()
    const host = config.host
    const token = window.localStorage.getItem("token")


    const nom = $("#nom").val()
    const prenom = $("#prenom").val()
    const email = $("#email").val()
    let phone = $("#phone").val()

    if(phone.length < 1){
        phone = null
    }

    const everyArray = [nom, prenom, email];

    if (phone) {
        phone.replaceAll(" ", "")
        everyArray.push(phone)
    }


    //ctrl des champs qu'il ne soient pas vide
    if (everyArray.every((current) => current.length > 0)) {
        const res = await fetch(`${host}/api/contact-favori/create`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                nom,
                prenom,
                email,
                phone
            })
        })

        const data = await res.json()
        if (data.success) {

            addContactDOM(data.data.id, data.data.nom, data.data.prenom, data.data.email, data.data.phone)

            //reset des champs
            $("#nom").val("")
            $("#prenom").val("")
            $("#email").val("")
            $("#phone").val("")

            createClassiqueModale(data.message)

        }
    } else {
        createClassiqueModale("Veuillez remplir tout les champs")
    }

})