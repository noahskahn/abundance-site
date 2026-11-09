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

/* Newsletter + search (added) */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };

  // Newsletter: until a signup service is configured (site.newsletter.action), just explain.
  document.querySelectorAll("form[data-newsletter]").forEach(function (f) {
    if (f.getAttribute("action")) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = $(".nl-note", f);
      if (n) n.hidden = false;
    });
  });

  // Search: tiny in-browser index (search.json), no libraries.
  var box = $("[data-search]");
  if (!box) return;
  var base = ($("link[rel=stylesheet]").getAttribute("href") || "").replace(/\/css\/site\.css.*$/, "");
  var input = $("#q", box), out = $("[data-results]", box), count = $("[data-count]", box);
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var rx = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
  var index = null;

  var run = function () {
    var q = input.value.trim().toLowerCase();
    if (!q) { out.innerHTML = ""; count.textContent = ""; return; }
    var terms = q.split(/\s+/).filter(Boolean);
    var hits = index.map(function (d) {
      var t = d.t.toLowerCase(), x = d.x.toLowerCase(), score = 0;
      for (var i = 0; i < terms.length; i++) {
        var inT = t.indexOf(terms[i]) > -1, inX = x.indexOf(terms[i]) > -1;
        if (!inT && !inX) return null;
        score += (inT ? 10 : 0) + (inX ? 1 : 0);
      }
      return { d: d, s: score };
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s; });
    count.textContent = hits.length + (hits.length === 1 ? " result" : " results") + " for “" + input.value.trim() + "”";
    var re = new RegExp("(" + terms.map(rx).join("|") + ")", "ig");
    out.innerHTML = hits.slice(0, 40).map(function (h) {
      var d = h.d, snip = d.x.length > 180 ? d.x.slice(0, 180) + "…" : d.x;
      return '<li><span class="kind">' + esc(d.s) + '</span><a href="' + base + d.u + '">' + esc(d.t).replace(re, "<mark>$1</mark>") + "</a><p>" + esc(snip).replace(re, "<mark>$1</mark>") + "</p></li>";
    }).join("");
  };

  fetch(base + "/search.json").then(function (r) { return r.json(); }).then(function (j) {
    index = j;
    var q = new URLSearchParams(location.search).get("q");
    if (q) input.value = q;
    input.addEventListener("input", run);
    run();
  });
})();
