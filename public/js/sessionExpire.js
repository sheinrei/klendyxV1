$(async function () {
    const resConf = await fetch("/config");
    const dataConf = await resConf.json();
    const host = dataConf.host

    const isConnect = async () => {
        try {
            const res = await fetch(`${host}/api/user/session`, {
                method: "GET"
            })
            const data = await res.json();
            return data.logged
        } catch (err) {
            return false
        }
    }

    const connected = await isConnect()
    connected ? $("#btnConnection").css("display", "none") : $("#btnDeconnection").css("display", "none")


    const urlProtect = [`${host}/contact-favori`, `${host}/agenda`]
    if (!connected) {
        $(".nav-none").css("display", "none");

        if(urlProtect.includes(window.location.href)){
            createClassiqueModale("Session expirée. <br> Vous allez être redirigé vers la page de connexion dans quelques instants.")
            setTimeout(()=>{
                window.location.href = `${host}/connexion`
            },2500)
        }
    }
})