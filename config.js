/* Configurare. Se editează o singură dată, după ce publici scriptul Google Apps Script (vezi README.md).
   Lăsat gol, aplicația funcționează fără server: studentul descarcă un fișier și ți-l trimite,
   iar tu îl încarci în zona profesorului. */
window.CALITAS_CONFIG = {
  // Pacientul pe care îl primesc toți studenții: "urgenta" (Andrei Marin, UPU), "ambulatoriu" (Elena Stoica),
  // "internare" (Radu Dumitrescu) sau "cronic" (Ioana Dinu). Lasă "" ca fiecare student să primească
  // automat unul dintre cei patru, în funcție de nume.
  profilFix: "urgenta",

  // Adresa aplicației web Apps Script (se termină în /exec). Exemplu:
  // "https://script.google.com/macros/s/AKfycb.../exec"
  endpoint: "",

  // Dacă este true, studentul trebuie să introducă un cod de sesiune (pe care îl anunți la oră).
  // Codul se setează în proprietățile scriptului (SESSION_CODE). Vezi README.md.
  cerCodSesiune: false
};
