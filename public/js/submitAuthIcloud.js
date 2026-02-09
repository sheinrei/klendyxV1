
$("#btn-submit").on("click", async function (e) {
    e.preventDefault();

    const resConfig = await fetch("/config");
    const dataConfig = await resConfig.json();
    const host = dataConfig.host

    const password = $("#password").val();
    const email = $("#email").val();

    const saveAuth = await fetch(`${host}/api/calendar/apple/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password,
            email
        })
    })

    const res = await saveAuth.json();
    createClassiqueModale(`<div>${res.message}</div>`)
    if(res.success){
        $("#password").val("")
        $("#email").val("")
    }
})


