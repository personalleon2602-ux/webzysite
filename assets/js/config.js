/* ==========================================================================
   WEBZY — Editable site configuration
   --------------------------------------------------------------------------
   The business email, Instagram profile and FormSubmit form are configured.
   ========================================================================== */

window.WEBZY_CONFIG = {
  /* Contact email — live. If you change it, also update the static
     no-JavaScript fallback text in the HTML pages. */
  contactEmail: "webzysite@hotmail.com",
  emailPlaceholder: false,

  /* Instagram — live profile. */
  instagramUrl: "https://www.instagram.com/webzysite/",
  instagramHandle: "@webzysite",
  instagramPlaceholder: false,

  /* WhatsApp — country code + number, digits only, e.g. "38344123456".
     Leave empty to hide the WhatsApp button and contact line. */
  whatsappNumber: "",
  whatsappMessage: "Përshëndetje WEBZY! Dua të di më shumë për një faqe interneti.",

  /* Client reviews — only real reviews, with the client's permission.
     Clients submit them at /vleresim.html; they arrive by email through
     FormSubmit and are published only after they are copied here.
     The "Vlerësime" section on the homepage stays hidden while this is empty.
     Example:
       { quote: "Faqja u bë gati për 7 ditë...", name: "Arben K.", rating: 5,
         business: "Kafe Luna, Prishtinë", url: "https://kafeluna.com" } */
  reviews: [],

  /* Contact form delivery through FormSubmit.
     ------------------------------------------------------------------------
     Submissions are POSTed to this AJAX endpoint and emailed to the contact
     address above. The recipient must click the one-time activation link
     sent by FormSubmit before submissions are delivered.

     The endpoint must accept POST requests and return a JSON success flag.
     Never put private API keys in this file. */
  formEndpoint: "https://formsubmit.co/ajax/webzysite@hotmail.com",

  /* "formdata" (works with FormSubmit and most form services) or "json".
     If your endpoint expects JSON, use "json". */
  formFormat: "formdata",

  /* Optional submission metadata. */
  subject: "Kërkesë e re për projekt — WEBZY",

  /* Copy shown only after a confirmed 2xx response. */
  successTitle: "Faleminderit!",
  successMessage: "Mesazhi u dërgua me sukses. Do të ju kontaktoj brenda 24 orëve.",

  /* Copy shown after a failed request or a non-2xx response. */
  errorMessage:
    "Diçka shkoi keq dhe mesazhi nuk u dërgua. Provoni përsëri, ose na shkruani direkt në email nëse problemi vazhdon."
};
