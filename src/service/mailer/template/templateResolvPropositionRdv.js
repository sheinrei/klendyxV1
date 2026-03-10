export const templateResolvPropositionRdv = `<div style="margin:20px">
                    <header style="margin-bottom:30px">
                        <p>Bonjour {NAME_INITIALISATEUR}</p>
                    </header>
                    
                    <div>
                        <p>{RECIPIENT_FULL_NAME} a répondu à votre demande de rendez-vous</p>
                        <p>Réponse : {RESPONSE_PROPOSITION}</p>
                        <p>Commentaire saisis avec la réponse : {COMMENTAIRE}</p>

                    </div>

                    <div style="margin-top:15px">
                        <p>A bientôt,</p>
                        <p>Votre équipe</p>
                    </div>
                </div>`