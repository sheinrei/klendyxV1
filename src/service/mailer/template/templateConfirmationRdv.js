export const templateConfirmationRdv =`
    <tr>
        <td style="padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr style="margin-bottom:30px;">
                    <td>
                        <p>Bonjour {prenom},</p>
                        <p style="padding-bottom:20px">Nous vous confirmons votre rendez-vous "{title}" avec {nameInitialisateur}</p>
                    </td>
                </tr>

                <tr>
                    <td>
                        <table style="width:fit-content;background-color: #F7FAFF;border-radius: 8px;padding: 20px 10px;margin:auto" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding-bottom:10px;">

                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>

                                            <td style="padding-right:15px; vertical-align:middle;">
                                                <svg style="width:40px; margin:0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M8 2v4"></path>
                                                    <path d="M16 2v4"></path>
                                                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                                    <path d="M3 10h18"></path>
                                                </svg>
                                            </td>

                                            <td style="vertical-align:middle;">
                                                <p style="margin:0;width:100%">Date</p>
                                                <p style="margin:0;width:100%">{DAY}</p>
                                            </td>

                                        </tr>
                                    </table>
                                </td>
                            </tr>


                            <tr>
                                <td>

                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>

                                            <td style="padding-right:15px; vertical-align:middle;">
                                                <svg style="width:40px; margin:0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                            </td>

                                            <td style="vertical-align:middle;">
                                                <p style="width:100%; margin:0">Horaire</p>
                                                <p style="width:100%; margin:0">{HOUR_START} à {HOUR_END}</p>
                                            </td>

                                        </tr>
                                    </table>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <tr style="margin-top:10px">
                    <td>
                        {COMMENTAIRE}
                    </td>
                </tr>

            </table>

        </td>
    </tr>
`