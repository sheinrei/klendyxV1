

export const templateValidationMatching = `
    <body style="margin: 0;padding: 0;width: 100% !important;background-color: #f8fafc;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
                <td style="padding: 20px 0;">
                    <table style="max-width: 600px;margin: 0 auto;background-color: #ffffff;" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                        
                        <!-- HEADER -->
                        <tr>
                            <td style="background-color: #716af9;padding: 40px 30px;text-align: center;border-radius:20px">
                                <h1 style="color: #ffffff;font-size: 28px;font-weight: 700;margin: 0;line-height: 1.3;">
                                    KLENDYX - Nouveau Rendez-vous
                                </h1>
                            </td>
                        </tr>
                        
                        <!-- CONTENT -->
                        <tr>
                            <td style="padding: 40px 30px;color: #1f2937">
                                <!-- SALUTATION -->
                                <p style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 20px 0;"">
                                    Bonjour,
                                </p>
                                
                                <!-- PARAGRAPHE PRINCIPAL -->
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Votre rendez-vous avec {initialisateur} a été confirmé.
                                </p>
                                
                                <!-- PARAGRAPHE SECONDAIRE (optionnel) -->
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Votre rdv : {titleEvent}<br>
                                    Date :  {dateEvent} de {hoursStart} à {hoursEnd}
                                </p>
                                

                                
                                <!-- DIVIDER -->
                                <div style="height: 2px;background-color: #e5e7eb;margin: 20px 0;"></div>
                                
                                <!-- TEXTE DE CLÔTURE -->
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Klendyx "Gérez votre emplois du temps, gagnez du temps."
                                </p>
                                
                                <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0 0 20px 0;">
                                    Cordialement,<br>
                                    <strong>Votre Équipe Klendyx</strong>
                                </p>
                                
                            </td>
                        </tr>                        
                    </table>
                </td>
            </tr>
        </table>
    </body>
    `;

