

$(document).on("click", ".delete-event-btn", async function (e) {
    e.preventDefault();
    const parent = $(this).closest(".cards-event");
    const eventId = parent.data("event-id");

    const res = await fetch("http://localhost:3000/api/event/delete", {
        method: "POST",
        headers: {
            "Content-type": "Application/json",
            "Authorization": "bearer " + token
        },
        body: JSON.stringify({ eventId: eventId })

    })

    const data = await res.json();
    if (data.success) {
        $(parent).remove()
    }

})




