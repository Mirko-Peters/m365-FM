(function () {
  var C = window.M365PWA;
  if (!C) return;
  var copy = {
    en: ["Install app", "Dismiss", "To install: tap Share, then Add to Home Screen. Notifications are available afterward."],
    de: ["App installieren", "Schließen", "Zum Installieren: Teilen antippen und „Zum Home-Bildschirm“ wählen. Danach sind Benachrichtigungen möglich."],
    es: ["Instalar app", "Cerrar", "Para instalar: toca Compartir y luego «Añadir a pantalla de inicio». Después podrás recibir notificaciones."],
    fr: ["Installer l’application", "Fermer", "Pour installer : touchez Partager, puis « Sur l’écran d’accueil ». Les notifications seront ensuite disponibles."],
    it: ["Installa l’app", "Chiudi", "Per installare: tocca Condividi, poi «Aggiungi alla schermata Home». In seguito saranno disponibili le notifiche."],
    pt: ["Instalar app", "Fechar", "Para instalar: toque em Compartilhar e depois em «Adicionar à Tela de Início». As notificações estarão disponíveis depois."],
    nl: ["App installeren", "Sluiten", "Installeren: tik op Deel en daarna op ‘Zet op beginscherm’. Daarna zijn meldingen beschikbaar."],
    pl: ["Zainstaluj aplikację", "Zamknij", "Aby zainstalować: stuknij Udostępnij, a następnie „Do ekranu początkowego”. Potem będą dostępne powiadomienia."],
    id: ["Instal aplikasi", "Tutup", "Untuk memasang: ketuk Bagikan, lalu Tambahkan ke Layar Utama. Notifikasi tersedia setelahnya."],
    ru: ["Установить приложение", "Закрыть", "Чтобы установить: нажмите «Поделиться», затем «На экран Домой». После этого станут доступны уведомления."],
    uk: ["Встановити застосунок", "Закрити", "Щоб установити: натисніть «Поділитися», а потім «На початковий екран». Після цього будуть доступні сповіщення."],
    ar: ["تثبيت التطبيق", "إغلاق", "للتثبيت: اضغط على «مشاركة»، ثم «إضافة إلى الشاشة الرئيسية». ستتوفر الإشعارات بعد ذلك."],
    he: ["התקנת האפליקציה", "סגירה", "להתקנה: הקישו על שיתוף ואז על הוספה למסך הבית. לאחר מכן ניתן יהיה לקבל התראות."],
    ja: ["アプリをインストール", "閉じる", "インストールするには、共有をタップして「ホーム画面に追加」を選択します。その後、通知を利用できます。"],
    ko: ["앱 설치", "닫기", "설치하려면 공유를 탭한 다음 ‘홈 화면에 추가’를 선택하세요. 이후 알림을 받을 수 있습니다."]
  };
  var t = copy[C.lang] || copy.en;
  function api(path, body) {
    return fetch(C.api + path, { method: "POST", credentials: "include", headers: { "content-type": "application/json", "x-requested-with": "m365" }, body: JSON.stringify(body) });
  }
  function track(event) {
    api("/api/pwa/event", { event: event, lang: C.lang, source: location.pathname }).catch(function () {});
  }
  function load(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script"); s.src = C.base + src; s.onload = resolve; s.onerror = reject; document.body.appendChild(s);
    });
  }
  function showSub(e) {
    e.preventDefault();
    var root = document.getElementById("pwa-subscribe");
    if (!root) return;
    root.hidden = false;
    if (!root.dataset.ready) {
      root.dataset.ready = "loading";
      var css = document.createElement("link"); css.rel = "stylesheet"; css.href = C.base + "/assets/community.css"; document.head.appendChild(css);
      load("/assets/cm-" + C.lang + ".js").then(function () {
        window.M365SUB = { api: C.api, lang: C.lang, source: location.pathname, iosHint: t[2] };
        return load("/assets/subscription.js");
      }).catch(function () { root.dataset.ready = ""; });
    }
    root.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.querySelectorAll("[data-pwa-subscribe]").forEach(function (a) { a.addEventListener("click", showSub); });
  if (location.search && new URLSearchParams(location.search).get("source") === "pwa") track("pwa_launch");
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(C.base + "/sw.js", { scope: C.base + "/" }).catch(function () {});
  }

  var box = document.getElementById("pwa-install"), text = document.getElementById("pwa-install-text");
  var action = document.getElementById("pwa-install-action"), close = document.getElementById("pwa-install-dismiss");
  function standalone() { return navigator.standalone || matchMedia("(display-mode: standalone)").matches; }
  function iosSafari() { return /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent); }
  function updateInstall() {
    var dismissed = false, installed = false, visits = 0;
    try { dismissed = localStorage.getItem("m365-pwa-dismissed") === "1"; installed = localStorage.getItem("m365-pwa-installed") === "1"; visits = +localStorage.getItem("m365-pwa-visits") || 0; } catch (e) {}
    if (!box || standalone() || dismissed || installed || visits < 2) return;
    if (iosSafari()) {
      text.textContent = t[2]; action.hidden = true;
    } else if (window.__m365InstallPrompt) {
      text.textContent = "M365.FM";
      action.textContent = t[0]; action.hidden = false;
    } else return;
    close.textContent = "×"; close.setAttribute("aria-label", t[1]); box.hidden = false;
  }
  window.__m365UpdateInstall = updateInstall;
  try { localStorage.setItem("m365-pwa-visits", String((+localStorage.getItem("m365-pwa-visits") || 0) + 1)); } catch (e) {}
  if (action) action.addEventListener("click", function () {
    var prompt = window.__m365InstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    prompt.userChoice.then(function () { window.__m365InstallPrompt = null; updateInstall(); });
  });
  if (close) close.addEventListener("click", function () { box.hidden = true; try { localStorage.setItem("m365-pwa-dismissed", "1"); } catch (e) {} });
  window.addEventListener("appinstalled", function () {
    track("appinstalled");
    box.hidden = true;
    try { localStorage.setItem("m365-pwa-installed", "1"); } catch (e) {}
  });
  try { updateInstall(); } catch (e) {}
})();
