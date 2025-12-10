


export function createOption(recipientEmail,nameInitialisateur, html,titleEvent){
        const mailOptions = {
        from: '"Klendyx" <no-reply@klendyx.com>',
        to: recipientEmail,
        subject: `Votre rendez-vous avec ${nameInitialisateur}`,
        text: titleEvent,
        html: html,
    };

    return mailOptions
}