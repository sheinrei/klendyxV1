
const addContactDOM = (id, nom, prenom, email, phone) => {
    const html = `
                <div id="contact-${id}" class="contact-row">
                    <p id="contact-nom-${id}"  style="grid-column:1"></p>
                    <p id="contact-prenom-${id}" style="grid-column:2"></p>
                    <p id="contact-phone-${id}" style="grid-column:3/5"></p>
                    <p id="contact-email-${id}" style="grid-column:5/7"></p>

                    <div  style="grid-column:7;display:flex; align-items:center;justify-content:center">
                    
                    <button id="btn-update" class="btn-contact-update" data-id="${id}">
                        <div class="svg-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
                            stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                <path d="m15 5 4 4"></path>
                            </svg>
                        </div>
                    </button>
                    
                    <button id="btn-delete" class="btn-contact-delete" data-id="${id}">
                        <div class="svg-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line>
                            </svg>
                        </div>
                    </button>
                    
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

    //ctrl des champs qu'il ne soient pas vide


    if (nom.length < 1) {
        createClassiqueModale("Merci de renseigner le nom");
        return
    }

    if (prenom.length < 1) {
        createClassiqueModale("Merci de renseigner le prenom");
        return
    }

    if (email.length < 1) {
        createClassiqueModale("Merci de renseigner au moin un email");
        return
    }

    if (phone.length < 1) {
        phone = null
    }

    if (phone) {
        phone.replaceAll(" ", "")
    }


    // fetch pour ajouter le nouveau contacts

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
        console.log(data)
        addContactDOM(data.data.id, data.data.nom, data.data.prenom, data.data.email, data.data.phone)

        //reset des champs
        $("#nom").val("")
        $("#prenom").val("")
        $("#email").val("")
        $("#phone").val("")

        createClassiqueModale(data.message)

    }

})