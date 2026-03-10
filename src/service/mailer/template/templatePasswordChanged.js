

export const templatePasswordChanged = `
                <div style="
                    font-family: Arial, sans-serif; 
                    color: #1f2937; 
                    line-height: 1.6; 
                    max-width: 600px; 
                    margin: auto; 
                    padding: 24px; 
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    border: 1px solid #e5e7eb;
                ">

                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="
                            margin: 0;
                            font-size: 24px;
                            background: linear-gradient(to right, rgba(113, 106, 249, 1) 0%, rgba(91, 9, 121, 1) 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        ">
                            Mot de passe modifié 🔒
                        </h2>
                    </div>

                    <p style="margin: 0 0 16px 0;">Bonjour {PRENOM},</p>

                    <p style="margin: 0 0 16px 0; color: #6b7280;">
                        Nous te confirmons que le mot de passe de ton compte <strong>Klendyx</strong> a bien été modifié avec succès.
                    </p>

                    <div style="margin: 28px 0; text-align: center;">
                        <a href="{URL}" style="
                            display: inline-block;
                            padding: 12px 20px;
                            background: #716af9;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                            transition: opacity 0.3s;
                        ">
                            Se connecter
                        </a>
                    </div>

                    <p style="font-size: 13px; color: #b3b7be; margin-top: 30px;">
                        Si tu n’es pas à l’origine de cette modification, contacte immédiatement notre support.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

                    <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px;">
                        <p style="font-size: 12px; color: #6b7280; margin: 0;">
                            © 2025 Klendyx — Tous droits réservés.
                        </p>
                    </div>
                </div>
    `;



