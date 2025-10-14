
export const sendSMS = async (phone, message) => {
    const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: "Calendyx",  
            recipient: phone,    
            content: message,
            type: "transactional"  
        })
    });

    const data = await res.json();

    console.log("data de l'envois de sms", data);
    
    if (data.message == 'Invalid telephone number'){
        return {success : false, message: "Numéro de telephone invalide."}
    }
    if (data.smsCount){
        return {success : true, message : "Sms envoyé avec succès."}
    }
};


