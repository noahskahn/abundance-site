(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mobile menu
  var toggle = $(".menu-toggle"), nav = $("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  // Dropdowns: click/tap toggles; hover works via CSS on desktop; Esc closes.
  var closeAll = function () {
    $$(".has-sub").forEach(function (o) {
      o.classList.remove("open");
      $(".nav-link", o).setAttribute("aria-expanded", "false");
    });
  };
  $$(".has-sub").forEach(function (li) {
    var btn = $(".nav-link", li);
    btn.addEventListener("click", function (e) {
      var open = !li.classList.contains("open");
      closeAll();
      li.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
      e.stopPropagation();
    });
  });
  document.addEventListener("click", closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  // Vimeo facade: only load the player when asked.
  $$("[data-vimeo]").forEach(function (box) {
    var btn = $(".play", box);
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://player.vimeo.com/video/" + box.getAttribute("data-vimeo") + "?autoplay=1&title=0&byline=0&portrait=0";
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      f.title = btn.getAttribute("aria-label").replace("Play video: ", "");
      box.innerHTML = "";
      box.appendChild(f);
    });
  });

  // Video playlist on About
  $$("[data-playlist]").forEach(function (pl) {
    var video = $("video", pl), buttons = $$("button[data-src]", pl);
    var load = function (b, play) {
      buttons.forEach(function (x) { x.removeAttribute("aria-current"); });
      b.setAttribute("aria-current", "true");
      video.src = b.getAttribute("data-src");
      if (play) video.play();
    };
    if (buttons[0]) video.src = buttons[0].getAttribute("data-src");
    buttons.forEach(function (b) { b.addEventListener("click", function () { load(b, true); }); });
  });

  // Drop remote images that no longer exist rather than leaving broken boxes.
  $$(".prose img").forEach(function (img) {
    var kill = function () { img.remove(); };
    if (img.complete && img.naturalWidth === 0 && img.src) kill();
    else img.addEventListener("error", kill);
  });

  // Contact form -> mailto (static site, no server)
  $$("form[data-mailto]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var body = d.get("message") + "\n\n— " + d.get("name") + " <" + d.get("email") + ">";
      location.href = "mailto:" + f.getAttribute("data-mailto") + "?subject=" +
        encodeURIComponent("Message from abundance.org") + "&body=" + encodeURIComponent(body);
    });
  });
})();
