/* ===================================================================================
   AYARLAR - Steam sayfan açılınca sadece buraya linki yapıştır, kaydet, siteyi tekrar yükle.
   Örnek: steamUrl: "https://store.steampowered.com/app/1234560/The_Last_Truck/"
   Boş kaldıkça butonlarda "Coming soon to Steam" yazar.
   =================================================================================== */
const SITE = {
  steamUrl: "",
};

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Steam buttons and links */
  document.querySelectorAll("[data-steam]").forEach((el) => {
    if (!SITE.steamUrl) return;
    const label = el.getAttribute("data-steam-label") || "Wishlist on Steam";
    if (el.tagName === "A") {
      el.href = SITE.steamUrl;
      el.removeAttribute("aria-disabled");
      el.classList.remove("btn--off");
      el.target = "_blank";
      el.rel = "noopener";
      const t = el.querySelector("[data-steam-text]");
      (t || el).textContent = label;
    } else {
      const a = document.createElement("a");
      a.href = SITE.steamUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = label;
      el.replaceChildren(a);
    }
  });
  document.querySelectorAll('a[aria-disabled="true"]').forEach((a) =>
    a.addEventListener("click", (e) => e.preventDefault())
  );

  /* Hero video: still picture for people who asked for less motion */
  const hero = document.querySelector(".hero__media video");
  if (hero && reduce) { hero.removeAttribute("autoplay"); hero.pause(); }

  /* Feature loops: load and play only while on screen */
  const loops = document.querySelectorAll("video[data-loop]");
  if (reduce) {
    loops.forEach((v) => { v.controls = true; });
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
      });
    }, { threshold: 0.25 });
    loops.forEach((v) => io.observe(v));
  } else {
    loops.forEach((v) => { v.autoplay = true; v.play().catch(() => {}); });
  }

  /* Trailer dialog */
  const tDlg = document.getElementById("trailer-dialog");
  if (tDlg) {
    const tv = tDlg.querySelector("video");
    document.querySelectorAll("[data-open-trailer]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        tDlg.showModal();
        tv.play().catch(() => {});
      })
    );
    tDlg.addEventListener("close", () => tv.pause());
    tDlg.addEventListener("click", (e) => { if (e.target === tDlg || e.target.classList.contains("dlg")) tDlg.close(); });
  }

  /* Screenshot viewer */
  const sDlg = document.getElementById("shot-dialog");
  const links = Array.from(document.querySelectorAll(".shots a"));
  if (sDlg && links.length) {
    const img = sDlg.querySelector("img");
    const count = sDlg.querySelector("[data-count]");
    let i = 0;
    const show = (n) => {
      i = (n + links.length) % links.length;
      img.src = links[i].href;
      img.alt = links[i].querySelector("img").alt;
      count.textContent = (i + 1) + " / " + links.length;
    };
    links.forEach((a, n) => a.addEventListener("click", (e) => { e.preventDefault(); show(n); sDlg.showModal(); }));
    sDlg.querySelector("[data-prev]").addEventListener("click", () => show(i - 1));
    sDlg.querySelector("[data-next]").addEventListener("click", () => show(i + 1));
    sDlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") show(i + 1);
    });
    sDlg.addEventListener("click", (e) => { if (e.target === sDlg || e.target.classList.contains("dlg")) sDlg.close(); });
  }

  document.querySelectorAll("[data-close]").forEach((b) =>
    b.addEventListener("click", () => b.closest("dialog").close())
  );

  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
