//Renvois le phone au forat +33...
function parseSmsNumber(phone) {

    let result = phone.split(" ").join("");
    const size = result.length

    if ((result[0] !== "+" && size !== 10) || (result[0] === "+" && size !== 12)) {
        return { success: false, message: "Longueur du numero de tel incorrect", phone: result, size }
    }

    if (result[0] !== "+") {
        result = "+33" + result.slice(1)
    }

    return { success: true, message: "Numero tel au bon format", phone: result }
}

const phone = ["06 66 90 93 93", "+336 43 34 24 53", "06 33 33 33 334", "06 33 33 33 3", "+336 43 34 24 5","+336 43 34 24 533"]

phone.map(e=>parseSmsNumber(e))