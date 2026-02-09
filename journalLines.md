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

18/11/25 =>

JS : 95 fichiers / 5535 lignes
CSS : 23 fichiers / 3057 lignes
HTML : 16 fichiers / 2428 lignes

Total fichiers : 134
Total lignes : 11020

19/11/25 =>

JS : 94 fichiers / 5337 lignes
CSS : 23 fichiers / 3109 lignes
HTML : 15 fichiers / 2415 lignes

Total fichiers : 132
Total lignes : 10861


21/11/25 =>

JS : 96 fichiers / 5476 lignes
CSS : 24 fichiers / 3677 lignes
HTML : 14 fichiers / 2424 lignes

Total fichiers : 134
Total lignes : 11577


06/12/25 Semaine entière consacré au front de l'app =>

JS : 103 fichiers / 6090 lignes
CSS : 27 fichiers / 4622 lignes
HTML : 16 fichiers / 3846 lignes

Total fichiers : 146
Total lignes : 14558

10/12/25 Fin de la création de rdv =>

JS : 108 fichiers / 6583 lignes
CSS : 27 fichiers / 4704 lignes
HTML : 16 fichiers / 4055 lignes

Total fichiers : 151
Total lignes : 15342

06/01/26 Connexion apple =>

JS : 132 fichiers / 8869 lignes
CSS : 28 fichiers / 5336 lignes
HTML : 18 fichiers / 4762 lignes

Total fichiers : 178
Total lignes : 18967