

class MessageAlert {
    static create(type, input, message) {
        const element = document.createElement("p")
        element.className = "message-alert"
        switch (type) {
            case "error":
                element.classList.add("message-alert-error")
                break
            case "warning":
                element.classList.add("message-alert-warning")
                break
            case "success":
                element.classList.add("message-alert-success")
                break
            case "information":
                element.classList.add("message-alert-information")
                break
            default:
                throw new Error(`Message Alerte de type ${type} n'est pas reconnu`)
        }

        element.textContent = message;
        $(input).append(element)
        $(".classique-modale-body, html , body").scrollTop(0)
        $()
    }

    
    static removeMessage(delay=5000) {
        setTimeout(()=>{
            $(".message-alert").remove()
        },delay)
    }
}

window.MessageAlert = MessageAlert

