$(async function () {

    const htmlNavbar = `
        <nav>
            <div class="list-nav">
                <a class="item-nav" href="/index">Accueil</a>
                <a class="item-nav" href="/connexion" id="btnConnection">Se connecter</a>
                <a class="item-nav" href="/index" id="btnDeconnection"">Se Deconnecter</a>
                <a class="item-nav nav-none" href="/mon-compte" id="btnMonCompte">Mon compte</a>
                <a class="item-nav nav-none" href="/dashboard">Tableau de bord</a>
                <a class="item-nav" href="/services">Services</a>
                <a class="item-nav nav-none" href="/event">Créer un evenement</a>
                <a class="item-nav" href="/contact">Contact</a>
                <a class="item-nav nav-none" href="/agenda">Agenda</a>
                <a class="item-nav nav-none" href="/contact-favori">Contact Favori</a>
            </div>
            <button class="btn-navbar-slide"></button>
        </nav>
`
    $("#content").prepend(htmlNavbar)



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