const htmlNavbar = `
    <nav class="navbar">
        <div class="navbar-header">
            <div class="navbar-brand">
                <svg class="navbar-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="navbar-brand-text">Calendyx</span>
            </div>
            <button class="navbar-toggle" aria-label="Toggle navigation">
                <span class="toggle-icon"></span>
            </button>
        </div>

        <div class="navbar-content">
            <div class="navbar-section">
                <span class="navbar-section-title">Navigation</span>
                <a class="navbar-item" href="/index">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span class="navbar-text">Accueil</span>
                </a>

                <a class="navbar-item" href="/services">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span class="navbar-text">Services</span>
                </a>

                <a class="navbar-item" href="/contact">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span class="navbar-text">Contact</span>
                </a>
            </div>

            <div class="navbar-section" id="userSection">
                <span class="navbar-section-title">Compte</span>
                
                <a class="navbar-item" id="btnConnection" href="/connection">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    <span class="navbar-text">Se connecter</span>
                </a>

                <a class="navbar-item" id="btnMonCompte" href="/mon-compte">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span class="navbar-text">Mon compte</span>
                </a>

                <a class="navbar-item" href="/dashboard">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span class="navbar-text">Tableau de bord</span>
                </a>

                <a class="navbar-item" href="/event">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span class="navbar-text">Créer un événement</span>
                </a>

                <a class="navbar-item navbar-item-danger" id="btnDeconnection" href="/index">
                    <svg class="navbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="navbar-text">Se déconnecter</span>
                </a>
            </div>
        </div>

    
    </nav>
    <div class="navbar-overlay"></div>
`;

$("#content").prepend(htmlNavbar);

// Gestion de l'authentification
const isConnect = window.localStorage.getItem("token");

if (isConnect) {
    $("#btnConnection").hide();
} else {
    $("#btnDeconnection").hide();
    $("#btnMonCompte").hide();
}

// État de la navbar
let isExpanded = true;

// Toggle navbar (rétraction/expansion)
$(".navbar-toggle").on("click", function() {
    const navbar = $(".navbar");
    
    // Sur mobile, gère l'ouverture du menu
    if (window.innerWidth <= 768) {
        navbar.toggleClass("navbar-mobile-open");
        $(".navbar-overlay").toggleClass("active");
        return;
    }
    
    // Toggle collapse pour desktop
    isExpanded = !isExpanded;
    if (isExpanded) {
        navbar.removeClass("navbar-collapsed");
    } else {
        navbar.addClass("navbar-collapsed");
    }
});

// Gestion de l'overlay mobile
$(".navbar-overlay").on("click", function() {
    $(".navbar").removeClass("navbar-mobile-open");
    $(this).removeClass("active");
});

// Fermer le menu mobile lors du clic sur un lien
$(".navbar-item").on("click", function() {
    if (window.innerWidth <= 768) {
        $(".navbar").removeClass("navbar-mobile-open");
        $(".navbar-overlay").removeClass("active");
    }
});

// Mise à jour de l'état au redimensionnement
$(window).on("resize", function() {
    if (window.innerWidth > 768) {
        $(".navbar").removeClass("navbar-mobile-open");
        $(".navbar-overlay").removeClass("active");
    }
});