# Spitalul Calitas: studiu de caz SERVQUAL

Aplicație web pentru masteranzi (anul I), la disciplina *Managementul calității în sistemul sanitar*. Fiecare student intră în rolul unui pacient al unui spital fictiv (Spitalul Clinic Universitar Calitas), își exprimă așteptările, trăiește o zi de spitalizare, evaluează spitalul pe cele 22 de enunțuri SERVQUAL și își vede rezultatele. Profesorul are o zonă separată cu rezultatele agregate, gândită pentru a fi proiectată în clasă.

Durata pentru student: aproximativ 45–50 de minute, individual. Restul orei se poate folosi pentru prezentarea rezultatelor grupului și discuție (vezi ghidul de dezbatere din zona profesorului).

## Ce conține

| Fișier | Rol |
|---|---|
| `index.html` | Aplicația studentului |
| `profesor.html` | Zona profesorului (rezultate, discrepanțe, nevoi, export) |
| `content.js` | Conținutul: spitalul, cele 22 de enunțuri, cele 4 profiluri de pacient |
| `cheie.js` | Material doar pentru profesor: neconformitățile introduse intenționat și ghidul de dezbatere |
| `config.js` | Configurare (adresa colectorului, codul de sesiune) |
| `demo.js` | Date demonstrative fictive (48 de studenți) |
| `Code.gs` | Colectorul Google Sheets (opțional, dar recomandat) |
| `style.css`, `core.js`, `app.js`, `teacher.js` | Aspectul, calculele SERVQUAL și logica celor două pagini |

Toate fișierele stau la același nivel, fără subfoldere.

## Fluxul studentului

1. **Date personale** (nume, prenume, grupă). Toți studenții intră în rolul aceluiași pacient: **Andrei Marin, 47 de ani, adus la UPU cu durere abdominală** (apendicită). Fiecare răspunde însă individual, din propria perspectivă.
2. **Prezentarea spitalului**, cu cifre, valori și «Cartea promisiunilor» (timpii pe care spitalul se angajează să-i respecte).
3. **Rolul tău**: persoana, vârsta, situația medicală, motivul prezentării.
4. **Așteptările** (22 de enunțuri, scala 1–5) pentru un *spital excelent*, completate înainte să vadă ce se întâmplă, apoi **importanța** relativă a celor 5 dimensiuni (100 de puncte).
5. **Parcursul** pas cu pas (6 momente), cu nota de la 1 la 5 pentru cum s-a simțit la fiecare moment, și o **fișă de parcurs** cu timpii de așteptare față de timpul de îngrijire efectivă.
6. **Percepțiile** (aceleași 22 de enunțuri, despre Spitalul Calitas) și două întrebări globale (mulțumire, recomandare 0–10).
7. **Rezultatele proprii**: IPCS, radar, discrepanțe pe dimensiuni, cele mai mari deficite.
8. **Trimitere** către profesor.

După începerea parcursului, așteptările nu mai pot fi modificate, iar după afișarea rezultatelor nu mai pot fi modificate nici percepțiile. Așa evaluarea nu este influențată retroactiv.

## Neconformitatea intenționată

În scenariul lui Andrei Marin, spitalul nu își respectă promisiunile de timp și nu informează pacientul (peste 3 ore pentru un cod galben promis în 60 de minute, ecran de apel stins, răspunsuri vagi, targă pe hol fără paravan). Scenariul conține și puncte forte reale (competența și amabilitatea personalului, aparatură nouă), ca studenții să deosebească problemele de proces de cele de competență. Lista completă este în zona profesorului, secțiunea **Cheia scenariului**.

## Zona profesorului (`profesor.html`)

Rezultatele sunt organizate pe file (Sinteză, Enunțuri, Prioritizare, Profiluri și parcurs, Nevoi și acțiuni, Studenți, Cheia scenariului, Dezbatere, Export). Butonul **Mod prezentare** mărește textul și ascunde panoul de încărcare, pentru proiector.

- Indicatori: IPCS (și varianta ponderată cu importanța), grad de satisfacție, NPS, timp de completare.
- Radar așteptări față de percepții, diferențele pe dimensiuni și pe cele 22 de enunțuri, distribuția IPCS.
- Matricea de prioritizare (importanță față de discrepanță).
- «Momentele adevărului» din parcursul pacientului, cu notele și observațiile studenților.
- Constatarea «Aceeași experiență, evaluări diferite»: enunțul la care studenții au perceput cel mai diferit aceeași poveste, bun de pornit discuția despre subiectivitatea calității percepute.
- Fișa fiecărui student: așteptări și percepții pe dimensiuni, nota la fiecare moment, observațiile scrise.
- Nevoi identificate și măsuri sugerate, cu trimiteri la clauzele ISO 9001.
- Rata de detecție a neconformității și semnale de calitate a răspunsurilor (răspunsuri aproape uniforme, timp sub 20 de minute).
- Ghid de dezbatere, export CSV (Excel) și JSON, tipărire sau PDF.

Pentru a vedea cum arată înainte de oră, apasă **Încarcă date demonstrative**.

## Alt pacient

Aplicația mai conține trei pacienți, pregătiți pentru alți ani sau alte grupe: Elena Stoica (ambulatoriu, programare întârziată), Radu Dumitrescu (internare programată, operație amânată) și Ioana Dinu (diabet, control trimestrial). Toți au aceeași neconformitate centrală, așteptarea lungă și neinformată.

- Ca să schimbi pacientul pentru toată grupa, modifică `profilFix` în `config.js` (`urgenta`, `ambulatoriu`, `internare` sau `cronic`).
- Ca fiecare student să primească automat unul dintre cei patru, lasă `profilFix: ""`. Zona profesorului afișează atunci și comparația dintre profiluri.
- Un link cu `?profil=internare` (sau alt profil) la final are prioritate față de setare.

## Publicare pe GitHub Pages

1. Creează un depozit (repository) pe GitHub. Din **Add file → Upload files**, selectează toate fișierele de mai sus deodată și apasă **Commit changes**.
2. **Settings → Pages → Deploy from a branch → `main` / root → Save.**
3. După un minut, aplicația este la `https://CONTUL-TAU.github.io/NUME-DEPOZIT/`, iar zona profesorului la `.../profesor.html`.

**Atenție:** un depozit public poate fi citit de oricine, deci și studenții pot deschide `cheie.js`. Dacă nu vrei asta, nu încărca fișierul pe GitHub și păstrează-l doar pe calculatorul tău. Zona profesorului funcționează și fără el.

## Colectarea răspunsurilor (Google Sheets)

GitHub Pages găzduiește doar pagini statice, deci pentru ca răspunsurile să ajungă la tine este nevoie de un colector. Cel inclus este gratuit și folosește contul tău Google.

1. Creează o foaie Google Sheets nouă.
2. **Extensii → Apps Script**, șterge conținutul și lipește `Code.gs`.
3. Rulează funcția `setup` o dată (acceptă autorizările). În **Vizualizare → Jurnal de execuție** apare cheia profesorului generată. Ca să folosești o cheie proprie sau un cod de sesiune: **Setări proiect → Proprietăți script**, adaugă `TEACHER_KEY` (și, opțional, `SESSION_CODE`).
4. **Implementare → Implementare nouă → Aplicație web**, *Execută ca: eu*, *Cine are acces: oricine*. Copiază adresa care se termină în `/exec`.
5. În `config.js` pune adresa la `endpoint`. Dacă vrei cod de sesiune, setează `cerCodSesiune: true` și anunță codul la oră.
6. La orice modificare ulterioară a scriptului trebuie creată o implementare nouă (versiune nouă).

Răspunsurile apar în foaia **Raspunsuri**, câte un rând pe student, cu A1–A22, P1–P22 și importanțele pe coloane, deci le poți folosi direct în Excel. Dacă un student retrimite, rândul lui se actualizează, nu se dublează. În `profesor.html` introduci cheia și apeși **Încarcă din Google Sheets**.

**Fără server:** lasă `endpoint` gol. Studentul descarcă un fișier `.json` la final și ți-l trimite, iar tu tragi toate fișierele în zona profesorului.

## Modificarea conținutului

Totul se află în `content.js`: textele celor 22 de enunțuri (`{S}`, `{s}`, `{G}` sunt înlocuite cu «Spitalul Calitas» sau «un spital excelent»), cifrele spitalului, «Cartea promisiunilor» și cele 4 scenarii (câmpurile `asteptare` și `serviciu` sunt în minute). Dacă schimbi timpii dintr-un scenariu, actualizează și `cheie.js`.

## Limite și presupuneri

- **IPCS** este calculat ca media diferențelor (percepție − așteptare) pe cele 5 dimensiuni, deoarece formula nu era păstrată în fișierul Excel încărcat (celulele conțineau doar valori). Dacă folosești la curs altă formulă, se modifică în `core.js`, funcția `analyze`.
- Colectorul Google acceptă trimiteri de la oricine are adresa; protecția este validarea datelor și, opțional, codul de sesiune. Datele se citesc doar cu cheia profesorului.
- Numele studenților sunt vizibile profesorului. Informează studenții despre prelucrare, conform politicii facultății. Nu se colectează date medicale reale; toate cazurile sunt fictive.
- Aplicația a fost verificată automat (calcule, parcurgerea completă a fluxului studentului, trimiterea către colector, zona profesorului) și vizual, în Chromium, pe calculator și pe telefon. Nu a fost testată în Safari pe iPhone; merită o încercare înainte de oră.
