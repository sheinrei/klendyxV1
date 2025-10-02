


export function createOption(recipientEmail, initialisateur, html,titleEvent){
        const mailOptions = {
        from: '"Calendyx" <no-reply@calendyx.com>',
        to: recipientEmail,
        subject: `Votre rendez-vous avec ${initialisateur}`,
        text: titleEvent,
        html: html,
    };

    return mailOptions
}