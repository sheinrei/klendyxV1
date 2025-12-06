async function getContactRender() {
    const config = await getConfig()
    const host = config.host;
    const nombreContactAfficghage = $("#nombre-contact-affichage").val()

    const res = await fetch(`${host}/api/contact-favori/get`, {
        method: "GET",

    })
    const data = await res.json()

    $("#contact-saved-subtitle").text(`${data.data.length} contacts enregistrés`)

    for (let i = 0; i < nombreContactAfficghage; i++) {
        if (!data.data[i]) {
            break
        }

        const id = data.data[i].id
        const nom = data.data[i].nom
        const prenom = data.data[i].prenom
        const email = data.data[i].email
        const phone = data.data[i].phone

        addContactDOM(id, nom, prenom, email, phone)

    }
}


$("#search-contact").on("input", async function () {
    $(".contact-row").remove()

    const config = await getConfig()
    const host = config.host;
    const token = window.localStorage.getItem("token")

    const input = $(this).val();

    if (input) {
        const res = await fetch(`${host}/api/contact-favori/search`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                searching: input
            })
        })

        const data = await res.json();
        console.log(data.data)

        data.data.forEach(element => {
            addContactDOM(element.id, element.nom, element.prenom, element.email, element.phone)
        });
        return
    }
    getContactRender()
})

getContactRender()
