


const lastPassword = $("#last-password").val()
const newPassword = $("#new-password").val()
const newPasswordConfirm = $("#new-password-confirm").val()
const alert = $("#message-alert-password")


$("#new-password").on("input", function () {
    const mdp = $(this).val()
    if (mdp.length < 1) {
        MessageAlert.removeMessage()
        return
    }
    checkPassword($(this).val());
});

$("#mdp").on("input", function () {
    const mdp = $(this).val()
    if (mdp.length < 1) {
        MessageAlert.removeMessage()
        return
    }
    checkPassword($(this).val());
});




function checkPassword(password) {
    MessageAlert.removeMessage();
    let strength = 0;
    let message = "";

    const rules = [
        { test: /.{8,}/, message: "Vous devez saisir au moins 8 caractères" },
        { test: /[A-Z]/, message: "Vous devez saisir au moins une majuscule" },
        { test: /[0-9]/, message: "Vous devez saisir au moins un chiffre" },
        { test: /[?$@#&!]/, message: "Vous devez saisir au moins un caractère spécial (?$@#&!)" },
    ];

    // check les regles
    for (const rule of rules) {
        if (!rule.test.test(password)) {
            message = rule.message;
            break;
        }
        strength++;
    }

    // Met à jour le message et la barre
    $("#strength-bar").prop("value", strength * 25);
    $("#strength-bar").prop("aria-valuenow", strength * 25);

    const progress = document.querySelector("progress")
    if (strength == 1) progress.style.setProperty("--primary-color", "#a35454");
    if (strength == 2) progress.style.setProperty("--primary-color", "#f59e0b");
    if (strength ==3) progress.style.setProperty("--primary-color", "#facc15"); 
    if (strength == 4)progress.style.setProperty("--primary-color", "#10b981"); 


    if (strength == 100) {
        MessageAlert.removeMessage()
        return
    }

    MessageAlert.create("warning", "#input-message-alert-password", message)
}


