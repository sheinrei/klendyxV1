export const templateValidationMatching = `
    <tr>
        <td style="padding:30px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#1f2937;">

            <!-- SALUTATION -->
            <p style="font-size:18px; font-weight:600; margin:0 0 20px 0;">
                Bonjour,
            </p>

            <!-- TEXTE PRINCIPAL -->
            <p style="font-size:16px; line-height:1.6; margin:0 0 20px 0;">
                Suite à la validation du matching de rendez-vous, le rendez-vous avec <strong>{initialisateur}</strong> 
                a été confirmé pour la date suivante :
            </p>

            <!-- INFOS RDV -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                <tr>
                    <td style="background-color:#f8fafc; border:1px solid #e5e7eb; padding:15px;">
                        <p style="margin:0; font-size:16px; line-height:1.6;">
                            📅 <strong>{titleEvent}</strong><br>
                            🕒 {dateEvent} de {hoursStart} à {hoursEnd}
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
`