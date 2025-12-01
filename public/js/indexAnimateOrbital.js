
// Variables pour l'animation
let animationId = null;
let isAnimating = true;

// Éléments des icônes
const emailIcon = document.getElementById('email-icon');
const smsIcon = document.getElementById('sms-icon');
const agendaIcon = document.getElementById('agenda-icon');



// Variables d'état pour l'animation
let angleEmail = 0;
let angleSms = Math.PI / 2; // 90 degrés de décalage
let angleAgenda = Math.PI; // 180 degrés de décalage

// Vitesses de rotation différentes pour chaque icône
const speedEmail = 0.01;
const speedSms = 0.0035;
const speedAgenda = 0.006;

// Rayons d'orbite
const radiusEmail = 100;
const radiusSms = 160;
const radiusAgenda = 130;


// Fonction pour mettre à jour la position des icônes
function updateIcons() {
    // Mettre à jour l'angle pour chaque icône
    angleEmail += speedEmail;
    angleSms += speedSms;
    angleAgenda += speedAgenda;

    // Calculer les nouvelles positions
    const emailX = radiusEmail * Math.cos(angleEmail);
    const emailY = radiusEmail * Math.sin(angleEmail);

    const smsX = radiusSms * Math.cos(angleSms);
    const smsY = radiusSms * Math.sin(angleSms);

    const agendaX = radiusAgenda * Math.cos(angleAgenda);
    const agendaY = radiusAgenda * Math.sin(angleAgenda);

    // Appliquer les nouvelles positions
    emailIcon.style.transform = `translate(${emailX - 30}px, ${emailY - 30}px)`;
    smsIcon.style.transform = `translate(${smsX - 30}px, ${smsY - 30}px)`;
    agendaIcon.style.transform = `translate(${agendaX - 30}px, ${agendaY - 30}px)`;

    // Continuer l'animation
    if (isAnimating) {
        animationId = requestAnimationFrame(updateIcons);
    }
}

// Fonction pour démarrer l'animation
function startAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        updateIcons();
    }
}



// Fonction pour réinitialiser l'animation
function resetAnimation() {
    // Réinitialiser les angles
    angleEmail = 0;
    angleSms = Math.PI / 2;
    angleAgenda = Math.PI;

    // Recalculer et appliquer les positions initiales
    const emailX = radiusEmail * Math.cos(angleEmail);
    const emailY = radiusEmail * Math.sin(angleEmail);

    const smsX = radiusSms * Math.cos(angleSms);
    const smsY = radiusSms * Math.sin(angleSms);

    const agendaX = radiusAgenda * Math.cos(angleAgenda);
    const agendaY = radiusAgenda * Math.sin(angleAgenda);

    emailIcon.style.transform = `translate(${emailX - 30}px, ${emailY - 30}px)`;
    smsIcon.style.transform = `translate(${smsX - 30}px, ${smsY - 30}px)`;
    agendaIcon.style.transform = `translate(${agendaX - 30}px, ${agendaY - 30}px)`;

    // Si l'animation était en cours, redémarrer
    if (isAnimating) {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        updateIcons();
    }
}


// Initialisation : positionner les icônes et démarrer l'animation
function init() {
    resetAnimation();
    startAnimation();
}

// Démarrer l'animation lorsque la page est chargée
window.addEventListener('DOMContentLoaded', init);
