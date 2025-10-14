


const lastPassword = $("#last-password").val()
const newPassword = $("#new-password").val()
const newPasswordConfirm = $("#new-password-confirm").val()
const alert = $("#message-alert-password")


$("#new-password").keypress(function () {
    checkpassword($("#new-password").val())
})




function checkpassword(password) {
    $(alert).text("")
    let strength = 0;

    password.length < 8 ?
        strength += 1 : $(alert).text("Vous devez saisir au moins 8 caracteres");

    password.match(/[A-Z]+/) ?
        strength += 1 : $(alert).text("Vous devez saisir au moins une majuscule");

    password.match(/[0-9]+/) ?
        strength += 1 : $(alert).text("Vous devez saisir au moins un chiffre");

    password.match(/[?$@#&!]+/) ?
        strength += 1 : $(alert).text("Vous devez saisir au moins un caractère sépcial (?$@#&!)");


    switch (strength) {
        case 0:
            $("#strength-bar").prop('value', 0);
            break;

        case 1:
            $("#strength-bar").prop('value', 25);
            break;

        case 2:
            $("#strength-bar").prop('value', 50);
            break;

        case 3:
            $("#strength-bar").prop('value', 75);
            break;

        case 4:
            $("#strength-bar").prop('value', 100);
            break;
    }
}