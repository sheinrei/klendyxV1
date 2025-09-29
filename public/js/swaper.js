// Gestion des onglets

$(document).ready(function () {
    $('.tab-btn').on('click', function () {
        const tabName = $(this).data('tab');

        // Retirer la classe active des onglets et contenu
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');

        // Ajouter la classe active à l'onglet cliqué et son contenu
        $(this).addClass('active');
        $('#' + tabName + '-tab').addClass('active');
    });

});
