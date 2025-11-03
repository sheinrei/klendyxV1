$(function () {
    const btn = document.getElementById("btnDeconnection")

    btn.addEventListener("click", async function (e) {
        e.preventDefault(e)

        const config = await getConfig()
        const host = config.host

        await fetch(`${host}/api/user/logout`, {
            method: "POST"
        })
        window.location.href = "/connexion";
    })

})
