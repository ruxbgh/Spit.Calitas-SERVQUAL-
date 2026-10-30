/* Conținutul studiului de caz: Spitalul Calitas (spital fictiv).
   Toate datele sunt fictive și create exclusiv în scop didactic.
   Tokenii din enunțuri: {S} = subiect cu majusculă, {s} = subiect în interiorul propoziției,
   {G} = forma de genitiv ("Spitalului Calitas" / "unui spital excelent"). */
window.CALITAS = {
  versiune: "1.0",

  dimensions: [
    { id: "T", nume: "Tangibilitate", scurt: "Tangibilitate", items: [1, 2, 3, 4],
      desc: "Aspectul fizic: aparatură, spații, ținuta personalului și materialele informative.",
      iso: "ISO 9001: 7.1.3 Infrastructura, 7.1.4 Mediul pentru operarea proceselor" },
    { id: "F", nume: "Fiabilitate", scurt: "Fiabilitate", items: [5, 6, 7, 8, 9],
      desc: "Capacitatea de a furniza serviciul promis, corect și la timpul promis.",
      iso: "ISO 9001: 8.5.1 Controlul furnizării serviciilor, 8.7 Ieșiri neconforme, 10.2 Acțiuni corective" },
    { id: "R", nume: "Capacitate de răspuns", scurt: "Capac. de răspuns", items: [10, 11, 12, 13],
      desc: "Disponibilitatea de a ajuta pacienții, de a-i informa și de a oferi servicii prompte.",
      iso: "ISO 9001: 7.4 Comunicare, 8.2.1 Comunicarea cu clienții, 8.5.1 Controlul furnizării" },
    { id: "S", nume: "Siguranță", scurt: "Siguranță", items: [14, 15, 16, 17],
      desc: "Competența și curtoazia personalului și capacitatea lui de a inspira încredere.",
      iso: "ISO 9001: 7.2 Competența, 7.3 Conștientizarea, 8.5.1 Controlul furnizării" },
    { id: "E", nume: "Empatie", scurt: "Empatie", items: [18, 19, 20, 21, 22],
      desc: "Atenție individualizată, program convenabil și înțelegerea nevoilor pacientului.",
      iso: "ISO 9001: 8.2.1 Comunicarea cu clienții, 9.1.2 Satisfacția clienților" }
  ],

  /* 22 de enunțuri SERVQUAL adaptate pentru serviciile medicale
     d = dimensiune, s = etichetă scurtă, a = acțiune corectivă sugerată (zona profesorului) */
  items: [
    { n: 1, d: "T", s: "Aparatură modernă", t: "{S} dispune de aparatură medicală modernă și funcțională.",
      a: "Plan de înnoire și mentenanță preventivă a aparaturii; registru al disponibilității echipamentelor." },
    { n: 2, d: "T", s: "Spații curate și plăcute", t: "Spațiile {G} (săli de așteptare, saloane, grupuri sanitare) sunt curate și plăcute vizual.",
      a: "Audit 5S al zonelor de așteptare, program de curățenie cu verificare pe liste, reparații prioritizate." },
    { n: 3, d: "T", s: "Ținuta personalului", t: "Personalul {G} are o ținută îngrijită și poartă echipament adecvat, cu nume și funcție vizibile.",
      a: "Reguli de ținută, dotare adecvată și ecusoane cu nume și funcție, vizibile pentru toți." },
    { n: 4, d: "T", s: "Materiale informative", t: "Materialele informative {G} (indicatoare, pliante, formulare) sunt clare și bine prezentate.",
      a: "Revizuirea semnalisticii și a materialelor, testate pe pacienți reali; actualizare anuală." },
    { n: 5, d: "F", s: "Termene respectate", t: "Când {s} promite un termen (ora programării, ora rezultatelor, ora intervenției), acesta este respectat.",
      a: "Timpi-țintă realiști, monitorizați lunar, și revizuirea «Cartei promisiunilor»." },
    { n: 6, d: "F", s: "Interesul conducerii", t: "Când un pacient are o problemă, conducerea {G} manifestă un interes real să o rezolve.",
      a: "Canal de sesizări cu responsabil și termen de răspuns; feedback obligatoriu către pacient." },
    { n: 7, d: "F", s: "Îndatoriri la timp, fără erori", t: "{S} își îndeplinește îndatoririle la timp și încearcă să evite erorile medicale și administrative.",
      a: "Liste de verificare, dublă verificare la punctele critice, analiza erorilor și a evenimentelor near-miss." },
    { n: 8, d: "F", s: "Servicii la ora promisă", t: "{S} furnizează serviciile medicale la ora promisă.",
      a: "Programări cu intervale realiste, fără suprapuneri, cu rezervă de timp pentru urgențe." },
    { n: 9, d: "F", s: "Servicii fără erori", t: "{S} insistă asupra unor servicii medicale fără erori (identificare corectă a pacientului, documente corecte, tratament corect).",
      a: "Verificări la sursă (identificare, documente) și audit periodic al scrisorilor medicale." },
    { n: 10, d: "R", s: "Informare exactă asupra timpului", t: "Personalul {G} îi informează pe pacienți exact despre momentul în care vor fi efectuate serviciile (consult, investigații, intervenții).",
      a: "Ecrane cu ordinea și timpul estimat de așteptare; informare activă la fiecare 30–45 de minute." },
    { n: 11, d: "R", s: "Servicii prompte", t: "Personalul {G} oferă servicii prompte pacienților.",
      a: "Hărți de proces (triaj, analize, imagistică), eliminarea blocajelor și reproiectarea fluxului." },
    { n: 12, d: "R", s: "Dispus să ajute", t: "Personalul {G} este dispus să îi ajute pe pacienți.",
      a: "Rol de «ghid al pacientului» la punctele critice (hol, UPU, ambulatoriu) și instruire în comunicare." },
    { n: 13, d: "R", s: "Niciodată prea ocupat", t: "Personalul {G} nu este niciodată prea ocupat pentru a răspunde solicitărilor pacienților.",
      a: "Dimensionarea personalului pe vârfuri de trafic; roluri dedicate pentru informare." },
    { n: 14, d: "S", s: "Comportament care inspiră încredere", t: "Comportamentul personalului {G} inspiră încredere pacienților.",
      a: "Prezentare nominală, explicarea pașilor și coerență între ce se promite și ce se face." },
    { n: 15, d: "S", s: "Siguranță în relația cu spitalul", t: "Pacienții se simt în siguranță în relația cu {s} (confidențialitate, siguranța pacientului, îngrijire fără riscuri).",
      a: "Protocoale de siguranță (identificare, consimțământ, confidențialitate la triaj și pe hol)." },
    { n: 16, d: "S", s: "Amabilitate constantă", t: "Personalul {G} este constant amabil cu pacienții.",
      a: "Sprijin împotriva epuizării personalului și recunoașterea bunelor practici." },
    { n: 17, d: "S", s: "Cunoștințe suficiente", t: "Personalul {G} are cunoștințele necesare pentru a răspunde întrebărilor pacienților.",
      a: "Fișe de informare standard, traininguri și o persoană de contact clar desemnată." },
    { n: 18, d: "E", s: "Atenție individuală (personal)", t: "Personalul {G} acordă atenție individuală fiecărui pacient.",
      a: "Timp minim de consult, evitarea ecranului ca barieră în comunicare, informare personalizată." },
    { n: 19, d: "E", s: "Program convenabil", t: "{S} are un program de funcționare convenabil pacienților (programări, ambulatoriu, vizite, farmacie).",
      a: "Program flexibil, programare online funcțională, coordonare cu transportul și cu orele de lucru ale pacienților." },
    { n: 20, d: "E", s: "Atenție personală (medici, asistenți)", t: "Medicii și asistenții {G} oferă atenție personală pacienților.",
      a: "Evaluări periodice ale comunicării medic–pacient, cu feedback structurat." },
    { n: 21, d: "E", s: "Interesul pacientului pe primul loc", t: "{S} pune pe primul plan interesele pacienților.",
      a: "Indicatori centrați pe pacient în planul de calitate; implicarea pacienților în comisii." },
    { n: 22, d: "E", s: "Înțelege nevoi speciale", t: "Personalul {G} înțelege nevoile speciale ale pacienților (vârstă, mobilitate, anxietate, program de lucru).",
      a: "Evaluarea nevoilor speciale la triaj sau internare; zone dedicate și sprijin pentru vârstnici." }
  ],

  spital: {
    nume: "Spitalul Clinic Universitar Calitas",
    sub: "Spital public universitar",
    motto: "Îngrijire sigură, la timp, cu respect.",
    despre: [
      "Spitalul Clinic Universitar Calitas este cel mai mare spital public din regiune și baza clinică a Facultății de Medicină. Primește pacienți din oraș și din trei județe învecinate, de la urgențe vitale până la controalele de rutină ale bolilor cronice.",
      "Spitalul este acreditat ANMCS și are un sistem de management al calității certificat ISO 9001. Toate datele din această prezentare sunt fictive și au fost create exclusiv pentru acest studiu de caz."
    ],
    cifre: [
      { v: "780", l: "paturi" },
      { v: "22", l: "secții clinice" },
      { v: "4.100", l: "angajați" },
      { v: "62.000", l: "prezentări la UPU pe an (aprox. 170 pe zi)" },
      { v: "210.000", l: "consultații în ambulatoriu pe an" },
      { v: "38.000", l: "internări pe an" }
    ],
    misiune: "Să oferim îngrijire sigură, la timp și cu respect fiecărui pacient, și să formăm specialiștii de mâine.",
    valori: [
      { t: "Siguranța pacientului", d: "Nicio procedură nu este mai importantă decât siguranța celui care o primește." },
      { t: "Respect", d: "Pacientul este tratat ca persoană, nu ca diagnostic." },
      { t: "Excelență clinică", d: "Decizii bazate pe dovezi și pe experiența echipei universitare." },
      { t: "Transparență", d: "Îi spunem pacientului ce urmează și cât durează." }
    ],
    structuri: [
      "Unitatea de Primiri Urgențe (UPU)", "Ambulatoriu integrat de specialitate (14 cabinete)",
      "Laborator de analize medicale", "Radiologie și imagistică", "Chirurgie generală",
      "Bloc operator (6 săli)", "Cardiologie", "Endocrinologie și diabet", "Farmacie cu circuit deschis"
    ],
    context: "În ultimii doi ani, numărul prezentărilor la UPU a crescut cu 18%. Conducerea a investit în aparatură nouă (imagistică, bloc operator, electrocardiografe), iar numărul de angajați a crescut cu 3%.",
    promisiuni: [
      "Triaj în maximum 10 minute de la înregistrare.",
      "Consult în UPU pentru codul galben în maximum 60 de minute, iar pentru codul verde în maximum 120 de minute.",
      "Programările din ambulatoriu sunt respectate cu o toleranță de maximum 30 de minute.",
      "Rezultatele analizelor de rutină sunt gata în maximum 2 ore, iar cele de urgență în maximum 60 de minute.",
      "Internarea programată: cazare în salon în maximum 60 de minute, iar ora intervenției este comunicată și respectată cu o toleranță de 60 de minute.",
      "Pacientul este informat la fiecare etapă despre ce urmează și cât durează.",
      "Scrisoarea medicală și instrucțiunile de externare sunt explicate înainte de plecare."
    ]
  },

  /* Patru profiluri de pacient. Implicit toți studenții îl primesc pe cel din config.js (profilFix);
     dacă profilFix este gol, fiecare student primește unul, determinat de numele lui. */
  profiles: [
    {
      id: "urgenta", eticheta: "Pacient în urgență (UPU)",
      persona: { nume: "Andrei Marin", varsta: 47, rol: "agent comercial", initiale: "AM", loc: "Unitatea de Primiri Urgențe" },
      intro: "Ești Andrei Marin, 47 de ani, agent comercial. De dimineață ai o durere în partea dreaptă a abdomenului, care s-a intensificat spre seară. Temperatura a urcat la 37,9 °C și nu mai poți sta drept. Soția ta, Carmen, te duce la UPU al Spitalului Calitas, unde nu ai mai fost niciodată. Ai citit pe site «Cartea promisiunilor» și speri că vei fi consultat repede și că cineva îți va spune clar ce urmează.",
      momente: [
        { id: "u1", ora: "19:10", titlu: "Intrarea în UPU și înregistrarea", asteptare: 12, serviciu: 4,
          promis: null,
          text: "Pe aleea spitalului, săgeata spre «UPU» te duce la rampa ambulanțelor; intrarea pentru pacienții care vin pe jos e după colț, iar indicatorul ei e acoperit de un afiș. La înregistrarea UPU sunt înaintea ta trei pacienți, unul pe targă, adus de ambulanță. După 12 minute, asistenta de la înregistrare îți cere buletinul și cardul de sănătate, te întreabă de când te doare, îți deschide fișa de urgență și îți prinde la încheietură brățara de identificare cu cod de bare. Îți verifică de două ori numele și data nașterii, apoi îți spune să aștepți chemarea la triaj." },
        { id: "u2", ora: "19:26", titlu: "Triajul", asteptare: 0, serviciu: 6,
          promis: "Triaj în maximum 10 minute de la înregistrare.",
          text: "Asistenta de triaj, Camelia, te întreabă rapid despre simptome și îți măsoară temperatura, tensiunea și saturația. Îți spune: «Cod galben, doamna doctor vă vede în curând». Nu îți explică ce înseamnă codul galben și nici cât ar putea dura până vei fi consultat." },
        { id: "u3", ora: "19:32", titlu: "Sala de așteptare", asteptare: 183, serviciu: 0,
          promis: "Consult în UPU pentru codul galben în maximum 60 de minute.",
          text: "Sala are 24 de locuri și 31 de persoane. Aparatul de apă este stricat, televizorul merge fără sonor, iar ecranul care ar trebui să afișeze ordinea consultațiilor este stins. Durerea crește. Carmen întreabă de două ori la înregistrare și primește de fiecare dată același răspuns: «Sunteți în sistem, vă cheamă doctorul». Observi că un pacient sosit după tine este chemat înaintea ta. Nimeni nu îți explică de ce." },
        { id: "u4", ora: "22:35", titlu: "Consultul medical", asteptare: 0, serviciu: 16,
          promis: null,
          text: "Dr. Ionescu își cere scurt scuze pentru aglomerație, te examinează atent și îți explică limpede ce suspectează: o inflamație a apendicului. Îți spune ce analize și ce ecografie urmează și răspunde la toate întrebările tale. Te simți pe mâini bune." },
        { id: "u5", ora: "22:51", titlu: "Analize și ecografie", asteptare: 130, serviciu: 22,
          promis: "Rezultatele analizelor de urgență sunt gata în maximum 60 de minute.",
          text: "Recoltarea durează 8 minute. Ecografia se face cu un aparat nou, cu imagini foarte clare, dar abia după 40 de minute petrecute pe un scaun pe hol. Rezultatele analizelor vin după aproximativ 90 de minute. Un asistent te anunță că «sunt în lucru», fără nicio oră estimată." },
        { id: "u6", ora: "01:23", titlu: "Decizia și drumul spre operație", asteptare: 115, serviciu: 25,
          promis: "Pacientul este informat la fiecare etapă despre ce urmează și cât durează.",
          text: "Chirurgul de gardă confirmă diagnosticul și îți explică operația și riscurile, apoi semnezi consimțământul. Nu există pat liber în chirurgie, așa că aștepți pe targă, pe holul UPU, aproape două ore, lângă alți pacienți și fără paravan. La 03:40 ești dus la blocul operator." }
      ]
    },
    {
      id: "ambulatoriu", eticheta: "Pacient programat în ambulatoriu",
      persona: { nume: "Elena Stoica", varsta: 58, rol: "profesoară de matematică", initiale: "ES", loc: "Ambulatoriul de cardiologie" },
      intro: "Ești Elena Stoica, 58 de ani, profesoară de matematică. De doi ani ai hipertensiune, iar medicul de familie te trimite la un control cardiologic. Ai obținut o programare pentru marți, la ora 09:00, confirmată prin SMS: «Vă rugăm să vă prezentați cu 30 de minute înainte». Ți-ai aranjat orele de la școală și ți-ai rezervat dimineața pentru acest control.",
      momente: [
        { id: "a1", ora: "Cu o săptămână înainte", titlu: "Programarea", asteptare: 25, serviciu: 5,
          promis: null,
          text: "Formularul online nu funcționează pe telefon. La numărul ambulatoriului suni de patru ori, iar cineva răspunde abia după 25 de minute de încercări. Doamna de la telefon este foarte politicoasă, găsește un loc și îți trimite SMS de confirmare. Nu ți se spune ce documente să aduci, în afară de biletul de trimitere." },
        { id: "a2", ora: "08:30", titlu: "Sosirea la spital", asteptare: 22, serviciu: 0,
          promis: null,
          text: "Parcarea este plină. Găsești loc după 22 de minute, pe o stradă din apropiere. Spre ambulatoriu ajungi urmând indicatoare vechi, unele cu săgeți contradictorii. Intrarea este curată, dar liftul este scos din funcțiune." },
        { id: "a3", ora: "08:52", titlu: "Înregistrarea", asteptare: 8, serviciu: 14,
          promis: null,
          text: "Funcționara de la ghișeu este amabilă și rapidă. Observi însă că numele tău este scris greșit pe fișă: «Stoicea». Corectarea durează 14 minute, pentru că trebuie chemată o colegă cu drepturi de modificare. Ți se spune să aștepți «în fața cabinetului 7»." },
        { id: "a4", ora: "09:14", titlu: "Pe coridor", asteptare: 156, serviciu: 0,
          promis: "Programările din ambulatoriu sunt respectate cu o toleranță de maximum 30 de minute.",
          text: "Pe coridor sunt 27 de persoane programate între 09:00 și 10:00. Ecranul de apel nu funcționează, scaunele sunt puține, iar în toaleta de lângă cabinet nu mai este hârtie. La 10:15 o asistentă spune: «Doamna doctor a avut o urgență». Nu ți se spune când vei intra. Intri la 11:50." },
        { id: "a5", ora: "11:50", titlu: "Consultul", asteptare: 0, serviciu: 14,
          promis: null,
          text: "Dr. Pop te primește cu un zâmbet și își cere scuze pentru întârziere. Te ascultă, îți ia tensiunea și îți explică foarte clar de ce îți schimbă tratamentul. În timpul consultului se uită des în ecran și te întrerupe de două ori, dar primești răspuns la toate întrebările." },
        { id: "a6", ora: "12:04", titlu: "EKG și scrisoarea medicală", asteptare: 20, serviciu: 12,
          promis: "Scrisoarea medicală și instrucțiunile sunt explicate înainte de plecare.",
          text: "EKG-ul se face imediat, cu un aparat nou. Pentru scrisoarea medicală aștepți 20 de minute. O citești în mașină și observi că data nașterii este greșită și că lipsește data următorului control. Numărul de telefon de pe antet sună ocupat de trei ori." }
      ]
    },
    {
      id: "internare", eticheta: "Pacient cu internare programată",
      persona: { nume: "Radu Dumitrescu", varsta: 39, rol: "inginer", initiale: "RD", loc: "Chirurgie generală" },
      intro: "Ești Radu Dumitrescu, 39 de ani, inginer. După două episoade de colică biliară, ai fost programat pentru îndepărtarea vezicii biliare prin laparoscopie. Ți s-a spus: «Prezentați-vă la 08:00 la Internări, nemâncat de la miezul nopții; operația este programată în jurul orei 11:00». Ți-ai luat trei zile de concediu și ți-ai aranjat totul acasă.",
      momente: [
        { id: "i1", ora: "08:00", titlu: "Biroul de internări", asteptare: 35, serviciu: 15,
          promis: null,
          text: "Sunt 14 persoane în fața ta, iar biroul de internări a deschis doar două ghișee din patru. Documentele (bilet de internare, analize, acte) sunt verificate atent, iar funcționara îți explică ce semnezi. Pe ușă, anunțul cu programul vizitelor este scris de mână și greu de citit." },
        { id: "i2", ora: "08:50", titlu: "Așteptarea patului", asteptare: 290, serviciu: 0,
          promis: "Internarea programată: cazare în salon în maximum 60 de minute.",
          text: "«Salonul se eliberează după vizita medicală», ți se spune. Aștepți pe un scaun, pe hol, nemâncat, cu bagajul în brațe, alături de alți șase pacienți aflați în aceeași situație. Nimeni nu îți spune ora estimată. Soția ta sună la secție și i se răspunde: «Nu știm încă»." },
        { id: "i3", ora: "13:40", titlu: "Salonul", asteptare: 0, serviciu: 25,
          promis: null,
          text: "Ești cazat într-un salon cu patru paturi: curat, cu lenjerie proaspătă, dar priza de lângă pat nu funcționează, iar aerul condiționat suflă direct spre tine. Asistenta Mirela este amabilă, îți măsoară parametrii, îți pune brățara și îți explică programul secției. Te întreabă dacă ai alergii și îți verifică din nou numele." },
        { id: "i4", ora: "14:05", titlu: "Consultul de anestezie", asteptare: 20, serviciu: 22,
          promis: null,
          text: "Aștepți 20 de minute la ușa cabinetului de anestezie. Dr. Vlad îți explică foarte clar tehnica, riscurile și ce ai de făcut, răspunde cu răbdare la întrebări și te îndeamnă să suni la secție dacă te mai gândești la ceva. Ți se pare competent și calm." },
        { id: "i5", ora: "14:47", titlu: "Amânarea operației", asteptare: 160, serviciu: 0,
          promis: "Ora intervenției este comunicată și respectată cu o toleranță de 60 de minute.",
          text: "Operația promisă pentru ora 11:00 nu a avut loc: sala a fost ocupată de o urgență, apoi de o intervenție mai lungă. La 15:30, un asistent îți spune doar: «Mai așteptați puțin». Ești nemâncat de aproape 16 ore, cu sete și anxios. Nu ți se explică ce se întâmplă și nici ce poți face între timp." },
        { id: "i6", ora: "17:27", titlu: "Operația și externarea", asteptare: 30, serviciu: 135,
          promis: "Scrisoarea medicală și instrucțiunile de externare sunt explicate înainte de plecare.",
          text: "Intri în sala de operație la 17:30. Blocul operator este modern; echipa se prezintă, îți verifică identitatea și îți explică fiecare pas. Operația decurge bine. A doua zi, la 09:00, medicul îți dă externarea pe hol, în patru minute, cu scrisoarea medicală în mână. Întrebările tale despre dietă și despre durerea de umăr rămân fără un răspuns clar." }
      ]
    },
    {
      id: "cronic", eticheta: "Pacient cu boală cronică (control trimestral)",
      persona: { nume: "Ioana Dinu", varsta: 62, rol: "pensionară, fostă bibliotecară", initiale: "ID", loc: "Laborator, endocrinologie, farmacie" },
      intro: "Ești Ioana Dinu, 62 de ani, pensionară și fostă bibliotecară. Ai diabet zaharat de tip 2 de 11 ani. La fiecare trei luni faci același traseu: analize, consult la endocrinologie și ridicarea rețetelor compensate. Locuiești în afara orașului și vii cu autobuzul de 06:00, așa că ai nevoie ca totul să se termine într-o singură dimineață. La recoltare ți s-a spus că rezultatele sunt gata «în aproximativ două ore».",
      momente: [
        { id: "c1", ora: "07:15", titlu: "Recoltarea analizelor", asteptare: 65, serviciu: 6,
          promis: null,
          text: "La laborator, coada începe de la intrarea în clădire. Ai bonul de ordine nr. 47, iar ecranul arată «29». Aștepți în picioare 65 de minute. Flebotomista, Daniela, este blândă, găsește vena din prima încercare și te întreabă dacă ai mâncat. Pe perete este un afiș cu un orar diferit de cel de pe site." },
        { id: "c2", ora: "08:26", titlu: "Rezultatele analizelor", asteptare: 190, serviciu: 0,
          promis: "Rezultatele analizelor de rutină sunt gata în maximum 2 ore.",
          text: "La ghișeu ți se spune: «Peste două ore». La 10:30 rezultatele nu sunt gata, pentru că sistemul informatic al laboratorului a avut o pană. Nu ești anunțată, afli doar dacă întrebi. Primești rezultatele la 11:36, tipărite, dar una dintre valori apare fără unitatea de măsură." },
        { id: "c3", ora: "11:36", titlu: "Coada la endocrinologie", asteptare: 80, serviciu: 0,
          promis: null,
          text: "La cabinetul de endocrinologie ești a opta în rând. Medicul a plecat la o ședință de serviciu și revine la 12:30. Pe hol sunt doar șase scaune pentru cincisprezece persoane, mulți dintre ei vârstnici. Stai pe pervazul ferestrei. Nu există apă, iar oboseala începe să se simtă. Intri în cabinet la 12:56." },
        { id: "c4", ora: "12:56", titlu: "Consultul", asteptare: 0, serviciu: 10,
          promis: null,
          text: "Dr. Sima te cunoaște din vizitele anterioare, te strigă pe nume și îți explică rezultatele fără termeni greu de înțeles. Constată că hemoglobina glicată a crescut și îți ajustează doza. Nu se uită în carnetul tău de glicemii. Consultul durează 10 minute, iar tu rămâi cu o întrebare despre alimentație." },
        { id: "c5", ora: "13:06", titlu: "Educația diabetică", asteptare: 10, serviciu: 20,
          promis: null,
          text: "Asistenta de educație diabetică, Luminița, te cheamă într-un cabinet separat. Îți ascultă problemele, îți arată cum să-ți ajustezi mesele și îți notează un număr la care poți suna. Este singurul moment în care te simți ascultată pe deplin. Broșura pe care o primești este din 2014, ruptă și cu informații depășite." },
        { id: "c6", ora: "13:36", titlu: "Rețetele și farmacia", asteptare: 55, serviciu: 10,
          promis: null,
          text: "Farmacia ambulatoriului se închide la 15:00, dar sistemul de prescripție electronică cade o oră. Aștepți 55 de minute pe un scaun de plastic. În final primești toate rețetele corect, cu explicații clare. Pierzi autobuzul de 14:30 și ajungi acasă abia cu cel de 17:00." }
      ]
    }
  ],

  cauzeIshikawa: ["Oameni (personal)", "Procese și fluxuri", "Echipamente și tehnologie", "Informare și comunicare", "Mediu și infrastructură", "Management și resurse"],

  responsabili: ["Conducerea spitalului", "Managerul calității", "Șef de secție / compartiment", "Asistent-șef", "Departamentul IT", "Compartimentul de relații cu publicul", "Alt responsabil"],
  termene: ["Imediat (sub 30 de zile)", "Termen scurt (1–3 luni)", "Termen mediu (3–12 luni)", "Termen lung (peste 12 luni)"],
  eforturi: ["Redus", "Mediu", "Ridicat"]
};
