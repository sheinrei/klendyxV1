export const templateResolvMatching = `
    <tr>
        <td style="padding:30px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#1f2937;">

            <!-- SALUTATION -->
            <p style="font-size:18px; font-weight:500; margin:0 0 20px 0;">
                Bonjour,
            </p>

            <!-- TEXTE PRINCIPAL -->
            <p style="font-size:16px; line-height:1.6; margin:0 0 20px 0;">
                Bonne nouvelle ! Tous les participants ont répondu à votre demande de rendez-vous.
            </p>

            <!-- BLOC INFO  -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                <tr>
                    <td style="background-color:#f0fdf4; border-left:4px solid #22c55e; padding:15px;">
                        <p style="font-size:16px; line-height:1.6; margin:0;">
                            🎯 <strong>Klendyx</strong> a terminé l'analyse des créneaux compatibles avec l’emploi du temps de tous vos correspondants.
                        </p>
                    </td>
                </tr>
            </table>

            <!-- TEXTE -->
            <p style="font-size:16px; line-height:1.6; margin:0 0 25px 0;">
                Pour finaliser cet événement et notifier tous les participants, veuillez valider votre choix :
            </p>

            <!-- CTA BUTTON -->
            <table cellpadding="0" cellspacing="0" style="margin:0 0 25px 0;">
                <tr>
                    <td style="background-color:#716af9; border-radius:6px; text-align:center;">
                        <a href="{url}" 
                           style="display:inline-block; padding:12px 24px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none;">
                            📅 Choisir une date
                        </a>
                    </td>
                </tr>
            </table>

            <!-- DIVIDER -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                    <td style="border-top:1px solid #e5e7eb;"></td>
                </tr>
            </table>

            <!-- FOOT TEXT -->
            <p style="font-size:14px; line-height:1.6; margin:0 0 20px 0;">
                Klendyx - "Gérez votre emploi du temps, gagnez du temps."
            </p>

            <p style="font-size:14px; line-height:1.6; margin:0;">
                Cordialement,<br>
                <strong>Votre équipe Klendyx</strong>
            </p>

        </td>
    </tr>
`