$(async function () {

    const htmlNavbar = `
        <nav>
            <div class="list-nav">
                <a class="item-nav" href="/index">Accueil</a>
                <a class="item-nav" id="btnConnection" href="/connexion">Se connecter</a>
                <a class="item-nav" id="btnDeconnection" href="/index">Se Deconnecter</a>
                <a class="item-nav" id="btnMonCompte" href="/mon-compte">Mon compte</a>
                <a class="item-nav" href="/dashboard">Tableau de bord</a>
                <a class="item-nav" href="/services">Services</a>
                <a class="item-nav" href="/event">Créer un evenement</a>
                <a class="item-nav" href="/contact">Contact</a>
                <a class="item-nav" id="btnAgenda" href="/agenda">Agenda</a>
                <a class="item-nav" id="btnAgenda" href="/contact-favori">Contact Favori</a>
            </div>
            <button class="btn-navbar-slide"></button>
        </nav>
`

    $("#content").prepend(htmlNavbar)


    const isConnect = async () => {
        try {
            const resConf = await fetch("/config");
            const dataConf = await resConf.json();
            const host = dataConf.host
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

    if (!connected) {
        $("#btnMonCompte").css("display", "none");
        $("#btnAgenda").css("display", "none");
    }

    //slide pour retract la navbar
    let displayNavbar = true
    $(".btn-navbar-slide").on("click", function () {
        displayNavbar ? (
            $(".list-nav").slideUp(),
            displayNavbar = false
        ) : (
            $(".list-nav").slideDown(),
            displayNavbar = true
        )
    })
})