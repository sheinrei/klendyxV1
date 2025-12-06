$(document).on("click", "#btn-update", function (e) {

    const element = this.closest(".contact-row");
    const id = element.id.split("-")[1];


    const update = `<div class="modal-form">
                        <p class="modal-title">Modifier le contact</p>
                        <p id="input-message-alert"></p>

                        <input type="hidden" id="id-contact" value="${id}">

                        <div class="form-group">
                            <label for="contact-nom-update">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z"/>
                                    <path fill-rule="evenodd" d="M8 8a3 3 0 100-6 3 3 0 000 6z"/>
                                </svg>
                                Nom 
                            </label>
                            <input type="text" id="contact-nom-update" name="contact-nom-update">
                        </div>

                        <div class="form-group">
                            <label for="contact-prenom-update">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z"/>
                                    <path fill-rule="evenodd" d="M8 8a3 3 0 100-6 3 3 0 000 6z"/>
                                </svg>
                                Prénom 
                            </label>
                            <input type="text" id="contact-prenom-update" name="contact-prenom-update">
                        </div>

                        <div class="form-group">
                            <label for="contact-email-update">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v1l-8 5-8-5V4z"/>
                                    <path d="M0 6.5v5A2.5 2.5 0 002.5 14h11a2.5 2.5 0 002.5-2.5v-5L8 11 0 6.5z"/>
                                </svg>
                                Email 
                            </label>
                            <input type="text" id="contact-email-update" name="contact-email-update">
                        </div>

                        <div class="form-group">
                            <label for="contact-phone-update">
                                <img width="16" height="16"
                                    src="https://img.icons8.com/ios/50/phone--v1.png" alt="phone icon" />
                                Téléphone
                            </label>
                            <input type="text" id="contact-phone-update" name="contact-phone-update">
                        </div>
                    </div>`

    createClassiqueModale(update)

    $("#contact-nom-update").val($(`#contact-nom-${id}`).text())
    $("#contact-prenom-update").val($(`#contact-prenom-${id}`).text())
    $("#contact-email-update").val($(`#contact-email-${id}`).text())
    $("#contact-phone-update").val($(`#contact-phone-${id}`).text())


    $(".classique-modale-footer").prepend("<button id='btn-update-submit' class='btn-primary'>Valider</button>")
})



$(document).on("click", "#btn-update-submit", async (e) => {
    e.preventDefault();
    const config = await getConfig()
    const host = config.host
    const token = window.localStorage.getItem("token")

    const nom = $("#contact-nom-update").val()
    const prenom = $("#contact-prenom-update").val()
    const email = $("#contact-email-update").val()
    const phone = $("#contact-phone-update").val()
    const id = $("#id-contact").val()

    const res = await fetch(`${host}/api/contact-favori/update`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            id,
            nom,
            prenom,
            email,
            phone,
        })
    })
    const data = await res.json();
    MessageAlert.create("success", "#input-message-alert", "Contact modifié.")
    $(".contact-row").remove()
    getContactRender()


})