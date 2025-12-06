function createClassiqueModale(content) {

    const html = `
        <div class="classique-modale-overlay">
            <div class="classique-modale">
                <div class="classique-modale-header">
                    <h2>Klendyx</h2>
                    <button class="btn-close-icon" id="btn-close-classique-modale">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="classique-modale-body">
                    <p>${content}</p>
                </div>
                
                <div class="classique-modale-footer">
                    <button class="btn-primary" id="btn-confirm-classique-modale">Fermer</button>
                </div>
            </div>
        </div>
    `

    $("body").append(html);

    // Animation d'entrée
    setTimeout(() => {
        $(".classique-modale-overlay").addClass("active");
    }, 10);

    // Fermeture au clic sur l'overlay
    $(".classique-modale-overlay").on("click", function (e) {
        if (e.target === this) {
            closeClassiqueModale();
        }
    });

    $("#btn-close-classique-modale, #btn-confirm-classique-modale").on("click", closeClassiqueModale);
}

function closeClassiqueModale() {
    $(".classique-modale-overlay").removeClass("active");
    setTimeout(() => {
        $(".classique-modale-overlay").remove();
    }, 300);
}