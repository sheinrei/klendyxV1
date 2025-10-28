

export function frontConfirmationCreateUser(loginUrl,contactUrl) {
    return `
  <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription confirmée</title>

    <style>
      :root {
            --main-color: grey;
            --main-border-color: black;
            --main-bg: red;
            --footer-bg: rgb(198, 198, 198);

            --primary-color: #716af9;
            --primary-hover: #5247c7;
            --secondary-color: #6b7280;

            --success-color: #10b981;
            --error-color: #ef4444;
            --background-color: #f8fafc;
            --card-background: #ffffff;

            --text-primary: #1f2937;
            --text-secondary: #6b7280;

            --border-color: #e5e7eb;
            --border-focus: #4f46e5;

            --shadow-light: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --border-radius: 12px;
            --border-radius-small: 8px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, var(--background-color) 0%, #e0e7ff 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            line-height: 1.6;
            color: var(--text-primary);
        }

        .container {
            background: var(--card-background);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-large);
            max-width: 500px;
            width: 100%;
            padding: 3rem 2.5rem;
            text-align: center;
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            animation: scaleIn 0.5s ease-out 0.2s both;
        }

        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }

        .checkmark svg {
            width: 50px;
            height: 50px;
            stroke: white;
            stroke-width: 3;
            fill: none;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: draw 0.5s ease-out 0.5s forwards;
        }

        @keyframes draw {
            to {
                stroke-dashoffset: 0;
            }
        }

        .title {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary-color), #7c3aed);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 0 1rem 0;
            letter-spacing: -0.025em;
        }

        .subtitle {
            color: var(--text-secondary);
            font-size: 1rem;
            margin: 0 0 2rem 0;
            font-weight: 400;
        }

        .info-box {
            background: var(--background-color);
            border-radius: var(--border-radius-small);
            padding: 1.5rem;
            margin: 2rem 0;
            text-align: left;
            border: 1px solid var(--border-color);
        }

        .info-box p {
            margin: 0;
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .info-box strong {
            color: var(--text-primary);
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            border: none;
            border-radius: var(--border-radius-small);
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: var(--transition);
            background: linear-gradient(135deg, var(--primary-color), #7c3aed);
            color: white;
            box-shadow: var(--shadow-medium);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-large);
            background: linear-gradient(135deg, var(--primary-hover), #6d28d9);
        }

        .btn:active {
            transform: translateY(0);
        }

        .footer-text {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .footer-text a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
        }

        .footer-text a:hover {
            color: var(--primary-hover);
        }

        @media (max-width: 600px) {
            .container {
                padding: 2rem 1.5rem;
            }

            .title {
                font-size: 1.5rem;
            }

            .subtitle {
                font-size: 0.9rem;
            }
        }
    </style>
</head>




<body>
    <div class="container">
        <div class="checkmark">
            <svg viewBox="0 0 52 52">
                <polyline points="14,27 22,35 38,19"/>
            </svg>
        </div>

        <h1 class="title">Compte activé avec succès !</h1>
        <p class="subtitle">Ton compte est maintenant opérationnel 🎉</p>
        <div class="info-box">
            <strong>✅ Validation confirmée</strong>
            <p>
                Ton adresse email a été vérifiée avec succès. 
                Tu peux maintenant te connecter et profiter de toutes les fonctionnalités de la plateforme.
            </p>
        </div>

        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.5rem;">
            Prêt à commencer ? Connecte-toi dès maintenant pour explorer ton espace.
        </p>

        <a href="${loginUrl}" class="btn">
            Se connecter
        </a>

        <p class="footer-text">
            Un problème ? <a href="${contactUrl}">Contacte notre support</a>
        </p>
    </div>
</body>
</html>`
}