export const templatePropositionRdv = `<tr>
    <td style="padding:20px;">
        <div style="margin:0; font-family:Arial, sans-serif; color:#333333;">
            <p>Bonjour {PRENOM},</p>
            <p>{NAME_INITIALISATEUR} vous propose un rendez-vous "{TITLE}"</p>

            <p style="margin:20px 0 10px 0; font-weight:bold;">Informations du rendez-vous :</p>

            <div 
            style="width:fit-content;
                margin-left:0;
                background-color: #F7FAFF;
                border-radius: 8px;
                padding: 20px 15px;
                margin-bottom: 30px;
                display:flex;
                flex-direction:column;
                gap:15px;
                margin:auto">

                <div style="display:flex; flex-direction:row; gap:15px; align-items:center;">
                    <svg style="width:40px; height:40px;" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                    </svg>
                    <div style="display:flex; flex-direction:column;">
                        <span>Date</span>
                        <span>{DAY}</span>
                    </div>
                </div>

                <div style="display:flex; flex-direction:row; gap:15px; align-items:center;">
                    <svg style="width:40px; height:40px;" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div style="display:flex; flex-direction:column;">
                        <span>Horaire</span>
                        <span>{HOUR_START} à {HOUR_END}</span>
                    </div>
                </div>

            </div>

            <div style="margin-bottom:20px;">
                {COMMENTAIRE}
            </div>

            <p style="margin-bottom:15px;">Merci de renseigner votre réponse en cliquant sur le bouton ci-dessous :</p>

            <a href="{URL}" style="
                display:inline-block;
                padding: 10px 20px;
                background: linear-gradient(to right, rgba(113,106,249,1) 0%, rgba(91,9,121,1) 100%);
                border-radius: 7px;
                color: white;
                text-decoration:none;
                font-weight:bold;
                margin:auto;
            ">Répondre</a>

            <div style="margin-top:25px;">
                <p>A bientôt,</p>
                <p>Votre équipe</p>
            </div>
        </div>
    </td>
</tr>`;