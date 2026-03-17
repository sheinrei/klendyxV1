$(document).on("click", "#btn-delete", async function (e) {
    e.preventDefault()

    const element = this.closest(".contact-row");
    const id = element.id.split("-")[1];

    const config = await getConfig()
    const host = config.host;

    const res = await fetch(`${host}/api/contact-favori/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            id
        })
    })
    const data = await res.json();


    if (data.success) {
        $(element).remove()
    }
})

