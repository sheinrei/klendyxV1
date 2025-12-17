class ProgressBarPassword {

    constructor(element, inputMessageAlert, password) {
        this.htmlProgress = $(`#${element}`)
        this.inputMessageAlert = $(`#${inputMessageAlert}`)
        this.password = password
    }

    static checkPassword(password) {
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


        return { message, strength }
    }

    update() {
        MessageAlert.removeMessage()
        const score = ProgressBarPassword.checkPassword(this.password)
        this.htmlProgress.val(score.strength * 25)
        
        $(this.htmlProgress).removeClass("strength-1 strength-2 strength-3 strength-4").addClass(`strength-${score.strength}`);
        
        MessageAlert.create("warning", this.inputMessageAlert, score.message)

        return this
    }

    show() {
        this.password.length < 1
            ? (this.htmlProgress.hide(), MessageAlert.removeMessage())
            : this.htmlProgress.show()
        return this
    }
}