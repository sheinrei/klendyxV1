export const templateForgotPassord = `
<tr>
    <td style="padding:40px 30px;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
        
        <!-- SALUTATION -->
        <p style="font-size:18px;font-weight:600;color:#1f2937;margin:0 0 20px 0;">
            Bonjour,
        </p>

        <!-- MESSAGE PRINCIPAL -->
        <p style="font-size:16px;line-height:1.6;color:#1f2937;margin:0 0 20px 0;">
            Vous avez fait une demande de réinitialisation de votre mot de passe.
        </p>

        <!-- MESSAGE SECONDAIRE -->
        <p style="font-size:16px;line-height:1.6;color:#1f2937;margin:0 0 20px 0;">
            Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous. 
            Ce lien sera valide uniquement pendant <strong>10 minutes</strong>.
        </p>

        <!-- CALL TO ACTION -->
        <div style="text-align:center;margin:35px 0;">
            <a href="{URL}" 
               style="display:inline-block;padding:14px 32px;background-color:#716af9;color:#ffffff !important;text-decoration:none;border-radius:8px;font-weight:600;font-size:16px;">
                Réinitialiser le mot de passe
            </a>
        </div>

        <!-- NOTE -->
        <p style="font-size:16px;line-height:1.6;color:#1f2937;margin:0 0 25px 0;">
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
        </p>
    </td>
</tr>
`;