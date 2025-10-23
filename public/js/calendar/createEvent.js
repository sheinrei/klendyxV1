$(function () {

    const token = window.localStorage.getItem("token")

    //formulaire de création event google.
    $("#submit-create-event").on("click", async function (e) {
        e.preventDefault();

        const config = await getConfig()
        const host = config.host

        const summary = $("#title-event").val();
        const description = $("#description").val();
        const dateStart = formatDateRfc3339($("#start-time").val());
        const dateEnd = formatDateRfc3339($("#end-time").val());

        const res = await fetch(`${host}/api/calendar/google/create`, {
            method: "POST",

            headers: {
                "Authorization": "Bearer " + token,
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                summary,
                description,
                dateStart,
                dateEnd
            })
        })

        const data = await res.json();


        const eventFC = {
            start: dateStart,
            end: dateEnd,
            id: data.googleEventId,
            title: summary,
            extendedProps: {
                origin: "google",
                data: {
                    data: data,
                    dateTime: dateStart,
                    start: { dateTime: dateStart, timeZone: "Europe/Paris" },
                    end: { dateTime: dateEnd, timeZone: "Europe/Paris" },
                    title: summary,
                    description,
                }
            },

            color: "white",
            borderColor: "pink",
            backgroundColor: "grey",
            textColor: "white",

            editable: false,
        }

        if (window.calendar) {
            window.calendar.addEvent(eventFC)
        }

    })
})

