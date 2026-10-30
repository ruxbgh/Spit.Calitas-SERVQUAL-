/* Configurare. Se editează o singură dată, înainte de oră (vezi README.md). */
window.CALITAS_CONFIG = {
  // Pacientul pe care îl primesc toți studenții: "urgenta" (Andrei Marin, UPU), "ambulatoriu" (Elena Stoica),
  // "internare" (Radu Dumitrescu) sau "cronic" (Ioana Dinu). Lasă "" ca fiecare student să primească
  // automat unul dintre cei patru, în funcție de nume.
  profilFix: "urgenta",

  // Doar dacă NU folosești scriptul de mai jos: linkul unui Google Form în care studenții lipesc codul
  // de rezultat. Exemplu: "https://forms.gle/AbCdEf123".
  linkFormular: "",

  // Trimitere directă în foaia ta Google Sheets (recomandat): adresa aplicației web obținute din Code.gs,
  // vezi README.md, secțiunea „Colectarea răspunsurilor”. Adresa (se termină în /exec). Exemplu:
  // "https://script.google.com/macros/s/AKfycb.../exec"
  endpoint: "https://script.google.com/macros/s/AKfycbwZDS3gt2gi-4MK7WRDduXwSW7NCiTeqzRkkdLuBFQ4IeFSM7Z7AA16owX-Gw2eXf_S/exec",

  // Dacă este true, studentul trebuie să introducă un cod de sesiune (pe care îl anunți la oră).
  // Codul se setează în proprietățile scriptului (SESSION_CODE). Vezi README.md.
  cerCodSesiune: false
};
