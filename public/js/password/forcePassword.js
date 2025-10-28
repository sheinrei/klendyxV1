


const lastPassword = $("#last-password").val()
const newPassword = $("#new-password").val()
const newPasswordConfirm = $("#new-password-confirm").val()
const alert = $("#message-alert-password")


$("#new-password").on("input", function () {
    checkPassword($(this).val());
});

function checkPassword(password) {
    alert.text(""); 


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
    alert.text(message);
    $("#strength-bar").prop("value", strength * 25);
}