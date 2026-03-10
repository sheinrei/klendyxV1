
export const templatePropositionRdv = `<div style="margin:20px">
                    <header style="margin-bottom:30px">
                        <p>Bonjour {PRENOM},</p>
                        <p>{NAME_INITIALISATEUR} vous propose un rendez-vous "{TITLE}" </p>
                    </header>

                    <p style="margin-bottom:20px">Information du rendez-vous :</p>

                    <div style="width:fit-content;margin-left:50px; background-color: #F7FAFF;border-radius: 8px;padding: 20px 10px;margin-bottom: 30px; display:flex; flex-direction:column;gap:10px">

                        <div style="display:flex; flex-direction:row; margin:0; gap:15px; align-items:center; justify-content:start">

                            <svg style="width:40px; margin:0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                            </svg>

                            <div style="display:flex; flex-direction:column; align-items:flex-start; margin:0">
                                <p style="margin:0;width:100%">Date</p>
                                <p style="margin:0;width:100%">{DAY}</p>
                            </div>
                        </div>


                        <div style="display:flex; flex-direction:row; margin:0; gap:15px; align-items:center; justify-content:start">

                            <svg style="width:40px; margin:0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>

                            <div style="display:flex; flex-direction:column; align-items:flex-start; margin:0">
                                <p style="margin:0;width:100%">Horaire</p>
                                <p style="margin:0;width:100%">{HOUR_START} à {HOUR_END}</p>
                            </div>
                        </div>

                    </div>

                    <div>
                        {COMMENTAIRE}
                    </div>

                    <p style="margin-bottom:15px">Merci de renseigner votre réponse en cliquant sur le boutton ci dessous  : </p>

                    <a href="{URL}"
                            style="
                                padding: 8px 15px;
                                background: linear-gradient(to right, rgba(113,106,249,1) 0%, rgba(91,9,121,1) 100%);
                                border-radius: 7px;
                                color: white;
                                border: none;
                                cursor: pointer;
                                position:relative;
                                left:70px;
                        ">Répondre
                     </a>

                    <div style="margin-top:15px">
                        <p>A bientôt,</p>
                        <p>Votre équipe</p>
                    </div>
                </div>`









