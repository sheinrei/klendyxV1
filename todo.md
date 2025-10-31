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


-Feature :
	Superposer deux utilisateurs pour définir d'dun rdv
	match user par session calendyx



===============

Juste for fun compte les lignes du projet

$exts=@(".js",".css",".html");$totalFiles=0;$totalLines=0;foreach($e in $exts){$files=Get-ChildItem -Recurse | Where-Object { $_.Extension -eq $e -and $_.FullName -notmatch "node_modules" };$lines=($files | Get-Content | Measure-Object -Line).Lines;Write-Host "$($e.Substring(1).ToUpper()) : $($files.Count) fichiers / $lines lignes";$totalFiles+=$files.Count;$totalLines+=$lines};Write-Host "`nTotal fichiers : $totalFiles";Write-Host "Total lignes : $totalLines"

30/10/2025 => 
JS : 75 fichiers / 3215 lignes
CSS : 15 fichiers / 1926 lignes
HTML : 13 fichiers / 1477 lignes

Total fichiers : 103
Total lignes : 6618