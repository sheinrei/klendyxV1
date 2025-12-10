
export async function sendLowRemainingcredit() {
    const message = "Niveau de crédit d'envois de sms faible va recharger https://app.brevo.com/billing/account/customize/message-credits"
    await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: "Klendyx",
            recipient: process.env.MY_PHONE,
            content: message,
            type: "transactional"
        })
    });
};
