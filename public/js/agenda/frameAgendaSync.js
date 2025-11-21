
// == deplier la frame sync calendar ==
let syncCalendarToogle = true
$("#retract-frame-calendar-sync").on("click", function (e) {
    const src = syncCalendarToogle ? "https://img.icons8.com/color/50/circled-chevron-down.png" : "https://img.icons8.com/fluency/48/circled-chevron-up.png"
    e.preventDefault()
    $(this).attr("src", src)
    syncCalendarToogle = !syncCalendarToogle
    $(".frame-item-calendar-sync").slideToggle(300);
})

$(document).on("click", "#btn-sync-calendar-google", async (e) => {
    e.preventDefault()
    let config = await getConfig()
    let host = config.host
    window.location.href = `${host}/api/calendar/auth`
})

$(document).on("click", "#btn-sync-calendar-apple", (e) => {
    e.preventDefault()
    createClassiqueModale("Cette fonctionalité n'est pas encore implémenté.")
})

$(document).on("click", "#btn-sync-calendar-outlook", (e) => {
    e.preventDefault()
    createClassiqueModale("Cette fonctionalité n'est pas encore implémenté.")
})