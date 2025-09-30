
const htmlNavbar = `
        <nav>
<div class="list-nav">
            <a class="item-nav" href="/index">Acceuil</a>
            <a class="item-nav" id="btnConnection" href="/connection">Se connecter</a>
            <a class="item-nav" id="btnDeconnection" href="/index">Se Deconnecter</a>
            <a class="item-nav" id="btnMonCompte" href="/mon-compte">Mon compte</a>
            <a class="item-nav" href="/dashboard">Tableau de bord</a>
            <a class="item-nav" href="/services">Services</a>
            <a class="item-nav" href="/event">Créer un evenement</a>
</div>
<button class="btn-navbar-slide"></button>
        </nav>
`

$("#content").prepend(htmlNavbar)


const isConnect = window.localStorage.getItem("token");

isConnect ? $("#btnConnection").css("display", "none") : $("#btnDeconnection").css("display", "none")

if(!isConnect){
    $("#btnMonCompte").css("display", "none")
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