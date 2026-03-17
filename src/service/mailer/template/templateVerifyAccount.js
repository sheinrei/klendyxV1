export const templateVerifyAccount = `
<tr>
    <td style="padding:40px 30px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; color:#1f2937;">
        
        <p style="font-size:18px;font-weight:600;margin:0 0 20px 0;">
            Bonjour,
        </p>

        <p style="font-size:16px;line-height:1.6;margin:0 0 20px 0;">
            Merci de vous être inscrit sur notre application <strong>Klendyx</strong>. 
            Nous sommes ravis de vous compter parmi nous 🎉
        </p>

        <p style="font-size:16px;line-height:1.6;margin:0 0 20px 0;">
            Pour activer votre compte, cliquez sur le bouton ci-dessous :
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td align="center" style="padding:30px 0;">
                    <a href="{URL}" 
                       style="display:inline-block;
                              padding:14px 32px;
                              background-color:#716af9;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:8px;
                              font-weight:600;
                              font-size:16px;">
                        Activer mon compte
                    </a>
                </td>
            </tr>
        </table>

        <p style="font-size:16px;line-height:1.6;margin:0 0 25px 0;">
            Si vous n’êtes pas à l’origine de cette inscription, vous pouvez simplement ignorer cet e-mail.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td style="padding:30px 0;">
                    <div style="height:1px;background-color:#e5e7eb;"></div>
                </td>
            </tr>
        </table>

        <p style="font-size:16px;line-height:1.6;margin:0;">
            Bienvenue encore une fois,<br>
            <strong>L’équipe Klendyx</strong>
        </p>

    </td>
</tr>
`