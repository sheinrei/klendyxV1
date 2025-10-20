
-Connect :
	->Remonter la page sur msg-alert quand submit new account
	->Controlle de la couleurs selon succes false/true
	->Ajouter système force password C/V dans config compte

	->Forgot password :
		->Faire le front
		->Ajouter les double verfi et le systeme de force

-Token : 
	->Quand Token jwt expiré deconnecter automatiquement;

-Api : 
	->Empêcher les utilisateurs de visiter les page d'api? Redirect Authorization? 


-Event : 
	->Ajouter la possibilité d'envoyer plusieurs contacte à la fois
	->Methode contacte : faire un front plus propre selon la selection de sms ou email

	->Faire la prévisualisation du mail ou sms?

	->Sms detecté carac spéciaux et les changer
	->Sms calculer la length total < 160 pour rester sur un seul sms
	->Sms Url pour redirect user vallidation event trop long voir pour le racourcir avec un token auth 16?

	->Email faire un jolie html pour chaque email avec les code couleurs de Calendyx
-Agenda : 
	->Dans config compte lancer la sync agenda?
	->Detecter quel est l'agenda à config?

	->Sync agenda google (OK):
		->Passer de readonly en write
		->Save le Refresh token? 
		->Check le Access token sinon relancer le auth? <- Quelle durée configurable?

	->Sync agenda apple
	->Sync agenda outlootk


	->Build un front agenda, quel lib? FullCalendar?
	->Modale pour declancher un event depuis espace agenda?


-Dashboard :
	->Card event en cours;
	->Graph des envoies sms/email
	->Graph %event en cours / %event validé/ %event refusé.

-Système de notification :
	->Mettre en place le systeme
	->Alerte quand un event à été modififé

-Models Contact : 
	->Créer la table;
		-> Besoin des data pour declancher un event
	->Faire le front formulaire ajout Contact
	->Lancer un event depuis un contacte directe et saisi auto des données.



->Page de contacte et support :
	->Mis en place du formulaire :
		->Faire des catégorie -> User non connect?
	->Faire la table pour la db?

-Page confidentialité :
	->A definir
	->Pregen par IA le texte

-Page CGV :
	->A définir
	->Pregen par IA


-Feature :
	Superposer deux utilisateurs pour définir d'dun rdv
	match user par session calendyx