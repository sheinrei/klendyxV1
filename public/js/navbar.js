$(async function () {
    //===== Data pour la construction de barnav =====
    const navbarConstructor = {
        "header": `
        <section class="navbar" id="navbar">
        <header class="navbar-header">
            <img class="navbar-logo" src="./../images/litleLogo.png" alt="logo de Klendyx">
            <p class="navbar-title">Klendyx</p>
        </header>

        <div class="navbar-content">
            <div class="navbar-frame-top">
                <p class="navbar-subtitle">Navigation</p>

                <button class="btn-retract" id="navbar-retract">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-panel-left">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="M9 3v18"></path>
                    </svg>
                </button>
            </div>
            <div class="navbar-collecion">
    `,

        "footer": `</div>
        </div>
    </section>
    `,

        "acceuil": {
            html: ` <a class="item-nav" href="/index" title="Accueil" id="navbar-index">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-house h-5 w-5 flex-shrink-0 transition-colors group-hover:text-sidebar-accent-foreground">
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                        <path
                            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                        </path>
                    </svg>
                    <p>Accueil</p>
                </a>`,
        },

        "connexion": {
            html: `<a class="item-nav" href="/connexion" id="navbar-connexion" title="Se connecter">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-users h-5 w-5 flex-shrink-0 transition-colors group-hover:text-sidebar-accent-foreground">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p>Se connecter</p>
                </a>`,
        },

        "deconnexion": {
            html: `<a class="item-nav" href="/index" id="btnDeconnection" title="Se déconnecter">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-users h-5 w-5 flex-shrink-0 transition-colors group-hover:text-sidebar-accent-foreground">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p>Se Deconnecter</p>
                </a>`,

        },
        "monCompte": {
            html: `<a class="item-nav" href="/mon-compte" title="Mon compte" id="navbar-mon-compte">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-settings h-5 w-5 flex-shrink-0 transition-colors group-hover:text-sidebar-accent-foreground">
                        <path
                            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z">
                        </path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <p>Mon compte</p>
                </a>`,

        },
        "dashboard": {
            html: ` <a class="item-nav" href="/dashboard" title="Tableau de bord" id="navbar-dashboard">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-layout-dashboard h-5 w-5 flex-shrink-0 transition-colors group-hover:text-sidebar-accent-foreground">
                        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                    </svg>
                    <p>Tableau de bord</p>
                </a>`,
        },
        "agenda": {
            html: `<a class="item-nav" href="/agenda" title="Agenda" id="navbar-agenda">
                    <img class="item-nav-logo" width="24" height="24"
                        src="https://img.icons8.com/ios/50/tear-off-calendar.png" alt="tear-off-calendar" />
                    <p>Agenda</p>
                </a>`,
        },
        "createEvent": {
            html: `<a class="item-nav" href="/creer-rdv" title="Créer un evenement" id="navbar-event">
                    <img class="item-nav-logo" width="50" height="50" src="https://img.icons8.com/ios/50/event-accepted-tentatively.png"
                        alt="event-accepted-tentatively" />
                    <p>Créer un rendez-vous</p>
                </a>`,
        },
        "contactsFavoris": {
            html: `<a class="item-nav" href="/contacts-favoris" title="Vos contact favoris" id="navbar-contacts-favoris">
                   <img class="item-nav-logo" width="24" height="24" src="https://img.icons8.com/comic/100/business-contact.png" alt="business-contact"/>
                    <p>Vos contact favoris</p>
                </a>`,
        },
        "contactUs": {
            html: `<a class="item-nav" href="/contact" title="Contactez-nous" id="navbar-contact">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                      <path d="M2 7l10 7 10-7"/>
                    </svg>
                    <p>Contactez-nous</p>
                </a>`,
        }
    }

    function createHtmlNavbar(stateConnected) {
        htmlNavbar += navbarConstructor["header"]

        if (stateConnected) {
            htmlNavbar += navbarConstructor["acceuil"].html
            htmlNavbar += navbarConstructor["deconnexion"].html
            htmlNavbar += navbarConstructor["monCompte"].html
            htmlNavbar += navbarConstructor["dashboard"].html
            htmlNavbar += navbarConstructor["agenda"].html
            htmlNavbar += navbarConstructor["createEvent"].html
            htmlNavbar += navbarConstructor["contactsFavoris"].html
            htmlNavbar += navbarConstructor["contactUs"].html
        } else {
            htmlNavbar += navbarConstructor["acceuil"].html
            htmlNavbar += navbarConstructor["connexion"].html
            htmlNavbar += navbarConstructor["contactUs"].html
        }


        htmlNavbar += navbarConstructor["footer"]
    }

    const isConnect = async (host) => {
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




    const resConf = await fetch("/config");
    const dataConf = await resConf.json();
    const host = dataConf.host


    let htmlNavbar = "";
    const connected = await isConnect(host)

    createHtmlNavbar(connected)
    $("#content").prepend(htmlNavbar)


    // === Gestion du background pour l'item a selon la page actuelle

    const url = document.location.href
    const currentPage = url.split("/")[3]
    const arrayUrl = ["index","connexion", "mon-compte", "dashboard", "agenda","event", "contacts-favoris", "contact"]
    arrayUrl.map((url)=> {
        if (url === currentPage){
            $(`#navbar-${url}`).css({
                "background" : "var(--gradient-title",
                "color" : "white",
                "font-weight" : "500"
            })
        }
    })




    // ==== Gestion de la retractation de la navigation =====
    const navbar = $(".navbar");
    const btnRetract = $("#navbar-retract")

    const Navbar = {
        minWidth: 55,
        speed: 11,

        initialWidth: navbar.width(),
        startWidth: 0,
        currentWidth: 0,

        isRetracted: false,
        isAnimating: false,
    }


    function animate() {
        Navbar.isAnimating = true;
        Navbar.startWidth = navbar.width();
        Navbar.currentWidth = Navbar.startWidth;
        !Navbar.isRetracted ? requestAnimationFrame(retract) : requestAnimationFrame(deploy);
    }

    function changeDisplayItem(state) {
        $(".navbar-collecion p").css("display", `${state ? "none" : "block"}`)
        $(".navbar-subtitle").css("display", state ? "none" : "block")
        $(".navbar-title").css("display", state ? "none" : "block");

    }

    function retract() {
        changeDisplayItem(!Navbar.isRetracted)
        btnRetract.addClass("btn-retract-activ")
        btnRetract.css("margin", "none")


        if (Navbar.currentWidth > Navbar.minWidth) {
            Navbar.currentWidth -= Navbar.speed;
            navbar.css("width", `${Navbar.currentWidth}px`);
            $(".navbar-logo").css("margin-bottom", "9px")
            requestAnimationFrame(retract);
        } else {
            Navbar.isRetracted = true;
            Navbar.isAnimating = false;
            navbar.addClass("navbar-state-retract")
        }
    }

    function deploy() {
        if (Navbar.currentWidth < Navbar.initialWidth) {
            Navbar.currentWidth += Navbar.speed;
            navbar.css("width", `${Navbar.currentWidth}px`);
            requestAnimationFrame(deploy);
        } else {
            changeDisplayItem(!Navbar.isRetracted)

            btnRetract.removeClass("btn-retract-activ")
            navbar.removeClass("navbar-state-retract")
            $(".navbar-logo").css("margin-bottom", "0px")

            Navbar.isRetracted = false;
            Navbar.isAnimating = false;
        }
    }


    //declanchement de la retractation ou du deploy
    $(document).on("click", "#navbar-retract", () => {
        if (!Navbar.isAnimating) {
            animate();
        }
    });

    //clic sur retractation selon width client
    const clientWidth = $("html").width();
    if (clientWidth < 1024) {
        $("#navbar-retract").click()
    }


})