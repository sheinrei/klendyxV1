$(async function () {

    const NAV_ITEMS = {

        header: `
            <section class="navbar" id="navbar">
                <header class="navbar-header">
                    <a href="/index" class="navbar-brand">
                        <img class="navbar-logo" src="/../images/litleLogo.png" alt="Logo Klendyx">
                        <span class="navbar-title">Klendyx</span>
                    </a>
                </header>

                <div class="navbar-body">
                    <div class="navbar-frame-top">
                        <span class="navbar-subtitle">Navigation</span>
                        <button class="btn-retract" id="navbar-retract" title="Réduire la navigation">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                <path d="M9 3v18"></path>
                            </svg>
                        </button>
                    </div>
                    <nav class="navbar-collection">
        `,

        footer: `
                    </nav>
                </div>
            </section>
        `,

        acceuil: {
            id: "index",
            html: `
                <a class="item-nav" href="/index" title="Accueil" id="navbar-index">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    </svg>
                    <span class="item-nav-label">Accueil</span>
                </a>`,
        },

        connexion: {
            id: "connexion",
            html: `
                <a class="item-nav" href="/connexion" title="Se connecter" id="navbar-connexion">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span class="item-nav-label">Se connecter</span>
                </a>`,
        },

        deconnexion: {
            id: "deconnexion",
            html: `
                <a class="item-nav" href="/index" title="Se déconnecter" id="btnDeconnection">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="item-nav-label">Se déconnecter</span>
                </a>`,
        },

        monCompte: {
            id: "mon-compte",
            html: `
                <a class="item-nav" href="/mon-compte" title="Mon compte" id="navbar-mon-compte">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span class="item-nav-label">Mon compte</span>
                </a>`,
        },

        dashboard: {
            id: "dashboard",
            html: `
                <a class="item-nav" href="/dashboard" title="Tableau de bord" id="navbar-dashboard">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                        <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                        <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                        <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                    </svg>
                    <span class="item-nav-label">Tableau de bord</span>
                </a>`,
        },

        agenda: {
            id: "agenda",
            html: `
                <a class="item-nav" href="/agenda" title="Agenda" id="navbar-agenda">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span class="item-nav-label">Agenda</span>
                </a>`,
        },

        createEvent: {
            id: "creer-rdv",
            html: `
                <a class="item-nav" href="/creer-rdv" title="Créer un rendez-vous" id="navbar-creer-rdv">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <line x1="12" y1="15" x2="12" y2="19"></line>
                        <line x1="10" y1="17" x2="14" y2="17"></line>
                    </svg>
                    <span class="item-nav-label">Créer un rendez-vous</span>
                </a>`,
        },

        contactsFavoris: {
            id: "contacts-favoris",
            html: `
                <a class="item-nav" href="/contacts-favoris" title="Contacts favoris" id="navbar-contacts-favoris">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <polyline points="16 11 17 13 21 13"></polyline>
                    </svg>
                    <span class="item-nav-label">Contacts favoris</span>
                </a>`,
        },

        contactUs: {
            id: "contact",
            html: `
                <a class="item-nav" href="/contact" title="Contactez-nous" id="navbar-contact">
                    <svg class="item-nav-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                        <path d="M2 7l10 7 10-7"></path>
                    </svg>
                    <span class="item-nav-label">Contactez-nous</span>
                </a>`,
        },
    };




    function buildNavbarHtml(isConnected) {
        const items = isConnected
            ? ["acceuil", "deconnexion", "monCompte", "dashboard", "agenda", "createEvent", "contactsFavoris", "contactUs"]
            : ["acceuil", "connexion", "contactUs"];

        return (
            NAV_ITEMS.header +
            items.map(key => NAV_ITEMS[key].html).join("") +
            NAV_ITEMS.footer
        );
    }



    //Etat de la connection
    async function isConnected(host) {
        try {
            const res = await fetch(`${host}/api/user/session`, { method: "GET" });
            const data = await res.json();
            return !!data.logged;
        } catch {
            return false;
        }
    }



    const { host } = await fetch("/config").then(r => r.json());
    const connected = await isConnected(host);

    $("#content").prepend(buildNavbarHtml(connected));




    //Gestion de la page actuelle pour affiché le css items active
    const currentPage = window.location.pathname.split("/")[1]
    Object.values(NAV_ITEMS).forEach(item => {
        if (item?.id === currentPage) {
            $(`#navbar-${item.id}`).addClass("item-nav--active");
        }
    });


    // ============================================================
    //  RÉTRACTATION — état géré par CSS transition + localStorage
    // ============================================================

    const STORAGE_KEY = "klendyx_navbar_retracted";
    const TRANSITION_MS = 260;

    const navbar    = $("#navbar");
    const btnRetract = $("#navbar-retract");

    let isRetracted = localStorage.getItem(STORAGE_KEY) === "true";
    let isAnimating = false;

    // Applique l'état initial sans transition (évite le flash au chargement)
    function applyState(retracted, animated = true) {
        if (!animated) navbar.addClass("navbar--no-transition");

        if (retracted) {
            $(".item-nav-label, .navbar-subtitle, .navbar-title").css("opacity", 0);
            navbar.addClass("navbar--retracted");
            btnRetract.addClass("btn-retract--active");

            if (!animated) {
                $(".item-nav-label, .navbar-subtitle, .navbar-title").css("display", "none");
            }
        } else {
            navbar.removeClass("navbar--retracted");
            btnRetract.removeClass("btn-retract--active");

            $(".item-nav-label, .navbar-subtitle, .navbar-title")
                .css({ display: "", opacity: "" });
        }

        if (!animated) {
            // On retire la classe au prochain frame pour re-activer les transitions
            requestAnimationFrame(() => navbar.removeClass("navbar--no-transition"));
        }
    }

    function toggle() {
        if (isAnimating) return;
        isAnimating = true;
        isRetracted = !isRetracted;
        localStorage.setItem(STORAGE_KEY, isRetracted);

        if (isRetracted) {
            // Cacher le texte d'abord, puis rétracter
            $(".item-nav-label, .navbar-subtitle, .navbar-title").css("opacity", 0);

            setTimeout(() => {
                navbar.addClass("navbar--retracted");
                btnRetract.addClass("btn-retract--active");
                $(".item-nav-label, .navbar-subtitle, .navbar-title").css("display", "none");
            }, 80);

        } else {
            // Déployer d'abord, puis montrer le texte
            navbar.removeClass("navbar--retracted");
            btnRetract.removeClass("btn-retract--active");

            $(".item-nav-label, .navbar-subtitle, .navbar-title")
                .css({ display: "", opacity: 0 });

            setTimeout(() => {
                $(".item-nav-label, .navbar-subtitle, .navbar-title").css("opacity", "");
            }, TRANSITION_MS - 60);
        }

        setTimeout(() => { isAnimating = false; }, TRANSITION_MS + 40);
    }

    // État initial (sans animation)
    applyState(isRetracted, false);

    // Déclenchement
    $(document).on("click", "#navbar-retract", toggle);

});