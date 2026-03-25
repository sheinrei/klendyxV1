

export const templateDeleteAccount = `
<tr>
    <td style="padding: 30px; font-family: Arial, sans-serif; color: #1f2937;">

        <!-- SALUTATION -->
        <p style="font-size:16px; margin:0 0 20px 0;">
            Bonjour,
        </p>

        <!-- TEXTE -->
        <p style="font-size:16px; line-height:1.5; margin:0 0 20px 0;">
            Nous avons reçu une demande de suppression de votre compte Klendyx.
        </p>

        <!-- WARNING BOX -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
            <tr>
                <td style="background-color:#fef2f2; border-left:4px solid #dc2626; padding:15px;">
                    <p style="margin:0; font-size:15px; line-height:1.5;">
                        ⚠️ <strong>Cette action est définitive.</strong><br>
                        Une fois confirmée, toutes vos données seront supprimées de manière irréversible.
                    </p>
                </td>
            </tr>
        </table>

        <!-- TEXTE -->
        <p style="font-size:16px; line-height:1.5; margin:0 0 25px 0;">
            Si vous êtes à l'origine de cette demande, cliquez ci-dessous pour confirmer :
        </p>

        <!-- BOUTON -->
        <table cellpadding="0" cellspacing="0" align="center" style="margin:0 0 25px 0;">
            <tr>
                <td align="center" bgcolor="#ee6e6e" style="border-radius:6px;">
                    <a href="{url}" 
                       style="display:inline-block; padding:12px 28px; font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none;">
                        Confirmer la suppression
                    </a>
                </td>
            </tr>
        </table>
    </td>
</tr>
`