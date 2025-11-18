event validatoin par client cassé!

search google avatar

Event Calendyx: 
	->Ajouter la possibilité d'envoyer plusieurs contacte à la fois
	->Methode contacte : faire un front plus propre selon la selection de sms ou email

	->Faire la prévisualisation du mail ou sms?

	->Sms detecté carac spéciaux et les changer
	->Sms calculer la length total < 160 pour rester sur un seul sms
	->Sms Url pour redirect user vallidation event trop long voir pour le racourcir avec un token auth 16?

	->Email faire un jolie html pour chaque email avec les code couleurs de Calendyx

	faire le scrollTo quand form submit


-Agenda : 
	->Afficher la liste des calendrier sync (google/google-apple)

	->Sync agenda apple => calDav
	->Sync agenda outlootk

	->ajouter la modale validation new event


-Dashboard :
	->Card event en cours;
	->Graph des envoies sms/email
	->Graph %event en cours / %event validé/ %event refusé.

-Système de notification :
	->Mettre en place le systeme
	->Alerte quand un event à été modififé


-Page CGV :
	->A définir
	->Pregen par IA


->debounce pour eviter refresh champs de recherche dynamique
->throttling
->Ou lib lodash


-Feature :
	Superposer deux utilisateurs pour définir d'dun rdv
	match user par session calendyx


-Param compte
	clic tn revoker google
===============

Juste for fun compte les lignes du projet

$exts=@(".js",".css",".html");$totalFiles=0;$totalLines=0;foreach($e in $exts){$files=Get-ChildItem -Recurse | Where-Object { $_.Extension -eq $e -and $_.FullName -notmatch "node_modules" };$lines=($files | Get-Content | Measure-Object -Line).Lines;Write-Host "$($e.Substring(1).ToUpper()) : $($files.Count) fichiers / $lines lignes";$totalFiles+=$files.Count;$totalLines+=$lines};Write-Host "`nTotal fichiers : $totalFiles";Write-Host "Total lignes : $totalLines"

30/10/2025 => 
JS : 75 fichiers / 3215 lignes
CSS : 15 fichiers / 1926 lignes
HTML : 13 fichiers / 1477 lignes

Total fichiers : 103
Total lignes : 6618

31/10/2025 =>
JS : 78 fichiers / 3316 lignes
CSS : 15 fichiers / 1926 lignes
HTML : 13 fichiers / 1845 lignes

Total fichiers : 106
Total lignes : 7087


03/11/25 =>
JS : 83 fichiers / 3555 lignes
CSS : 16 fichiers / 1945 lignes
HTML : 13 fichiers / 1887 lignes

Total fichiers : 112
Total lignes : 7387

04/11/25 =>
JS : 85 fichiers / 3695 lignes
CSS : 16 fichiers / 1945 lignes
HTML : 14 fichiers / 2017 lignes

Total fichiers : 115
Total lignes : 7657

05/11/25 =>

JS : 86 fichiers / 3894 lignes
CSS : 16 fichiers / 1949 lignes
HTML : 14 fichiers / 2110 lignes

Total fichiers : 116
Total lignes : 7953


06/11/25 => 

JS : 88 fichiers / 4086 lignes
CSS : 16 fichiers / 1949 lignes
HTML : 14 fichiers / 2115 lignes

Total fichiers : 118
Total lignes : 8150

08/11/25 =>

JS : 89 fichiers / 4588 lignes
CSS : 16 fichiers / 1949 lignes
HTML : 15 fichiers / 2134 lignes

Total fichiers : 120
Total lignes : 8671

13/11/25 =>

JS : 93 fichiers / 5130 lignes
CSS : 17 fichiers / 2107 lignes
HTML : 16 fichiers / 2315 lignes

Total fichiers : 126
Total lignes : 9552

14/11/25 =>

JS : 93 fichiers / 5299 lignes
CSS : 19 fichiers / 2491 lignes
HTML : 16 fichiers / 2274 lignes

Total fichiers : 128
Total lignes : 10064  


17/11/25 =>

JS : 94 fichiers / 5429 lignes
CSS : 20 fichiers / 2795 lignes
HTML : 16 fichiers / 2332 lignes

Total fichiers : 130
Total lignes : 10556