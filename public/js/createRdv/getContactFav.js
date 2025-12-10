

function displayResultContactFav(data) {
    const html = `<div id="input-contact-fav"></div>`;

    $(".search-bar").append(html)

    for (let i = 0; i < 3; i++) {
        if (data[i]) {
            $("#input-contact-fav").append(`<p
                 class="search-finding-row"
                  data-nom="${data[i].nom}"
                  data-prenom="${data[i].prenom}"
                  data-email="${data[i].email}"
                  data-phone="${data[i].phone}"
                  >
                  
                  ${data[i].email}
                  </p>`)
        }
    }
}


//clic sur un choix proposé envois la data dans le formulaire
$("body").on("click", ".search-finding-row", function (e) {
    const target = $(e.target)
    const data = $(target).data()
    $("#data-rdv-nom").val(data.nom);
    $("#data-rdv-prenom").val(data.prenom);
    $("#data-rdv-email").val(data.email);

    if (data.phone !== "non renseigné") {
        $("#data-rdv-phone").val(data.phone);
    }
    $("#input-contact-fav").remove()
    window.location.href = "#frame-info-client"
})






$("#search-bar").on("input", async function () {
    $("#input-contact-fav").remove()
    const input = $(this).val();
    const config = await getConfig()
    const host = config.host;

    if (input) {
        const res = await fetch(`${host}/api/contact-favori/search`, {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                searching: input
            })
        })

        const data = await res.json();
        if (data.data) {
            displayResultContactFav(data.data)
        }

    }
})


//nettoie la value quand on sort de l'inpit
$("#search-bar").on("blur", function () {
    $("#search-bar").val("");
})

$("#frame-searching-bar").on("mouseleave", function () {
    $("#input-contact-fav").remove()
})