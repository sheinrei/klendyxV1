export const templatePasswordChanged = `
<tr>
    <td style="padding: 30px; font-family: Arial, sans-serif; color: #1f2937;">

        <!-- TITLE -->
        <p style="font-size:20px; font-weight:bold; text-align:center; margin:0 0 25px 0;">
            Mot de passe modifié 🔒
        </p>

        <!-- SALUTATION -->
        <p style="margin:0 0 15px 0; font-size:16px;">
            Bonjour {PRENOM},
        </p>

        <!-- TEXT -->
        <p style="margin:0 0 20px 0; font-size:16px; line-height:1.5;">
            Nous vous confirmons que le mot de passe de votre compte <strong>Klendyx</strong> a été modifié avec succès.
        </p>

        <!-- CTA BUTTON -->
        <table cellpadding="0" cellspacing="0" align="center" style="margin:25px 0;">
            <tr>
                <td align="center" bgcolor="#716af9" style="border-radius:6px;">
                    <a href="{URL}" 
                       style="display:inline-block; padding:12px 24px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">
                        Se connecter
                    </a>
                </td>
            </tr>
        </table>

        <!-- WARNING -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
            <tr>
                <td style="background-color:#fff7ed; border-left:4px solid #f97316; padding:15px;">
                    <p style="margin:0; font-size:14px; line-height:1.5;">
                        Si vous n'êtes pas à l’origine de cette modification, veuillez contacter immédiatement notre support.
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>
`