export const templateResolvPropositionRdv = `
<tr>
    <td style="
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        color: #333333;
        line-height: 1.6;
        padding: 30px 25px;  /* marge interne globale */
    ">
        
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding-bottom:25px;">
                    Bonjour {NAME_INITIALISATEUR},
                </td>
            </tr>

            <tr>
                <td style="padding-bottom:15px;">
                    {RECIPIENT_FULL_NAME} a répondu à votre demande de rendez-vous.
                </td>
            </tr>

            <tr>
                <td style="padding-bottom:15px;">
                    <strong>Réponse :</strong> {RESPONSE_PROPOSITION}
                </td>
            </tr>

            <tr>
                <td style="padding-bottom:25px;">
                    <strong>Commentaire :</strong> {COMMENTAIRE}
                </td>
            </tr>
        </table>

    </td>
</tr>
`