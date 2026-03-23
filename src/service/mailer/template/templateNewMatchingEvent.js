


export const templateNewMatchingEvent = `
    <tr>
        <td style="padding:30px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color:#1f2937;">
            
            <!-- SALUTATION -->
            <p style="font-size:18px; font-weight:600; margin:0 0 20px 0;">
                Bonjour,
            </p>
            
            <!-- TEXTE PRINCIPAL -->
            <p style="font-size:16px; line-height:1.6; margin:0 0 20px 0;">
                {INITIALISATEUR} vous a fait une demande de rendez-vous.
            </p>
            
            <p style="font-size:16px; line-height:1.6; margin:0 0 20px 0;">
                Afin de convenir d'une disponibilité mutuelle, merci de cliquer sur le lien ci-dessous.
            </p>
            
            <!-- CTA -->
            <div style="text-align:center; margin:30px 0;">
                <a href="{URL}" 
                   style="display:inline-block; padding:14px 28px; background-color:#716af9; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;">
                    Choisir une date
                </a>
            </div>
            
            <!-- INFOS -->
            <div style="background-color:#f8fafc; border-left:4px solid #716af9; padding:15px; margin:25px 0; border-radius:6px;">
                <p style="margin:0; font-size:14px; line-height:1.6;">
                    <strong>💡 Détails du rendez-vous :</strong><br><br>
                    - Titre : {EVENT_TITLE}<br>
                    - Adresse : {EVENT_ADRESS}<br>
                    - Description : {EVENT_DESCRIPTION}<br>
                    - Durée : {EVENT_DURATION}H<br>
                    {NOMBRE_PARTICIPANT}
                </p>
            </div>
            
            <!-- SEPARATEUR -->
            <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;">
            
            <!-- SIGNATURE -->
            <p style="font-size:14px; margin:0 0 10px 0;">
                Klendyx — "Gérez votre emploi du temps, gagnez du temps."
            </p>
            
            <p style="font-size:14px; margin:0;">
                Cordialement,<br>
                <strong>Votre équipe</strong>
            </p>

        </td>
    </tr>
`;

