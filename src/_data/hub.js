// Shapes the raw crawl (pages.json) into the structures the templates use.
const cheerio = require("cheerio");
const rawPages = require("./pages.json");
const fresh = require("./newContent.js");

// ---------------------------------------------------------------- editorial policy (from Stephen's + Hugo's feedback)
// Removed outright: the COVID response fund page and the two BCG/COVID posts both reviewers agreed to drop.
const REMOVED = new Set([
  "/health/the-abundance-covid-19-response-fund/",
  "/covid/",
  "/letter-from-dr-stephen-kahn-about-urgent-covid-19-research-on-bcg-vaccine/",
]);
// Past projects: moved to the Archive (Hugo's "archive" marks). Held back pending a decision:
// MMSc-GHD (/health/hmghd/) because Stephen wants to feature its cohort/graduate numbers.
const ARCHIVED = new Set([
  "/health/globalhealth/", "/health/haitisheroes/", "/health/residency/", "/health/rwandahealth/",
  "/health/globalhealtheffectiveness/", "/health/agentsofchange/", "/socialmedconf/",
  "/empowerment/hagn/", "/empowerment/dd/", "/empowerment/fonkoze/",
  "/empowerment/abundance-fund-for-reparations-and-redistributive-justice/",
  "/arts-education/agencybydesign/", "/arts-education/cine/", "/arts-education/voiceofwitness/",
  "/arts-education/united/", "/arts-education/upward/", "/arts-education/olc/", "/arts-education/vad/",
  "/arts-education/chapter510/",
]);
// Projects funded through the Harvard Abundance Fund (Hugo: move Harvard Medical School + Out of Eden Learn here).
const HAF_PATHS = new Set(["/health/hms/", "/arts-education/ooel/"]);
const RECENT_NEWS = [
  "/expanding-influence-through-strategic-philanthropy/",
  "/strengthening-communication-for-impact/",
  "/advancing-health-equity-in-africa/",
];

const pages = rawPages.filter((p) => !REMOVED.has(p.path));

const by = Object.fromEntries(rawPages.map((p) => [p.path, p]));
const load = (html) => cheerio.load(`<div id="r">${html || ""}</div>`, null, false);
const text = (html) => load(html)("#r").text().replace(/\s+/g, " ").trim();
const clip = (s, n) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n).replace(/\s+\S*$/, "");
  return cut.replace(/[,;:.\s]+$/, "") + "…";
};
const stripEllipsis = (s) => s.replace(/\s*(\.{3}|…)\s*$/, "").trim();

// ---------------------------------------------------------------- areas
const AREAS = [
  {
    slug: "health",
    name: "Health",
    color: "teal",
    hero: "/img/c/todres-licensed-baby-doctor.jpg",
    short: "Treating and preventing disease through medical education and health system strengthening.",
  },
  {
    slug: "empowerment",
    name: "Empowerment",
    color: "orange",
    hero: "/img/c/01_todres-girlsmiling.jpg",
    short: "Training leaders, improving safety and building the tools for stability and sustainability.",
  },
  {
    slug: "arts-education",
    name: "Arts & Education",
    color: "green",
    hero: "/img/arts-hero.jpg",
    short: "Showcasing the transformative power of art and letting innovative education projects take flight.",
  },
];

const areas = AREAS.map((a) => {
  const pg = by[`/${a.slug}/`];
  const $ = load(pg.body);
  const intro = $(".impact-summary").first().html() || "";
  const projects = $("#impact-projects article")
    .map((_, el) => {
      const $el = $(el);
      const href = $el.find(".item-title a").attr("href");
      return {
        title: $el.find(".item-title").text().trim(),
        href,
        thumb: $el.find("img").attr("src") || "",
        summary: stripEllipsis($el.find(".item-summary").clone().find("a").remove().end().text().replace(/\s+/g, " ").trim()),
        area: a.slug,
      };
    })
    .get();
  const all = [
    ...projects.filter((p) => !REMOVED.has(p.href)),
    ...fresh.projects.filter((p) => p.area === a.slug).map((p) => ({
      title: p.title, href: p.path, thumb: p.image, summary: p.summary, area: a.slug, group: p.group || "", funder: p.funder,
    })),
  ].map((p) => ({
    ...p,
    funder: p.funder || (HAF_PATHS.has(p.href) ? fresh.HAF : ""),
    status: ARCHIVED.has(p.href) ? "past" : "active",
  }));
  const haf = all.filter((p) => p.funder === fresh.HAF);
  return {
    ...a, path: pg.path, intro, introText: text(intro),
    projects: all.filter((p) => p.status === "active" && p.funder !== fresh.HAF),
    past: all.filter((p) => p.status === "past"),
    groups: [...new Set(all.filter((p) => p.status === "active" && p.funder !== fresh.HAF).map((p) => p.group).filter(Boolean))],
    haf,
  };
});
const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]));

// ---------------------------------------------------------------- posts
const newsPage = by["/news-updates/"];
const $n = load(newsPage.body);
const listed = $n("#articles .item-title a").map((_, a) => $n(a).attr("href")).get();
const featuredPaths = $n("article.one-half .item-title a").map((_, a) => $n(a).attr("href")).get();

const CAT_LABEL = {
  "abundance-news": "Abundance News",
  "news-updates": "News & Updates",
  "get-involved": "Get Involved",
};

const allPosts = pages.filter((p) => p.kind === "post" && p.path !== "/why-partner/");
const order = [...featuredPaths, ...listed];
const rank = (p) => {
  const i = order.indexOf(p.path);
  return i === -1 ? 9999 : i;
};
const decorate = (p) => {
  const $ = load(p.body);
  const img = $("img").first().attr("src") || "";
  const t = text(p.body);
  return {
    ...p,
    categoryLabel: CAT_LABEL[p.category] || p.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "News",
    image: img.startsWith("/img/") && !/team_noimage|icon/.test(img) ? img : "",
    excerpt: clip(t, 200),
    excerptLong: clip(t, 300),
  };
};
// posts that are really "get involved" pages stay out of the news feed
const oldNews = allPosts
  .filter((p) => p.category !== "get-involved" && p.path !== "/our-partners/" && p.path !== "/impact-abundance-project-for-global-health/")
  .sort((a, b) => rank(a) - rank(b) || 0)
  .map(decorate);

// 2026 updates from the board report, shaped like posts
const projByPath = Object.fromEntries(fresh.projects.map((p) => [p.path, p]));
const newPosts = fresh.news.map((n) => {
  const pr = n.link && projByPath[n.link];
  const body = n.body || `<p>${pr.summary}</p>`;
  const full = body + (n.link ? `<p><a class="more" href="${n.link}">Read the full project page</a></p>` : "");
  return {
    path: n.path, title: n.title, kind: "post", category: "2026-update", categoryLabel: n.cat,
    body: full, image: fresh.PH, placeholder: true, excerpt: clip(text(body), 200), excerptLong: clip(text(body), 300),
  };
});
const recentOld = oldNews.filter((p) => RECENT_NEWS.includes(p.path));
const news = [...newPosts, ...recentOld];
const newsArchive = oldNews.filter((p) => !RECENT_NEWS.includes(p.path));

// -------------------------------------------------------------- detail pages
const RESERVED = new Set([
  "/", "/about/", "/news-updates/", "/contact/", "/donate/", "/press/", "/get-involved/",
  "/privacy/", "/refundpolicy/", "/donate-2/", "/staff/", "/staff-member/",
  ...AREAS.map((a) => `/${a.slug}/`),
]);
const newDetailPages = fresh.projects.map((p) => ({
  path: p.path, title: p.title, kind: "page", lead: p.lead, body: "", area: p.area, funder: p.funder, group: p.group || "", image: p.image, placeholder: true,
}));
const flatProjects = areas.flatMap((a) => [...a.projects, ...a.past, ...a.haf]);
const details = [...pages.filter((p) => p.kind === "page" && !RESERVED.has(p.path)), ...newDetailPages]
  .map((p) => {
    const seg = p.path.split("/").filter(Boolean);
    const areaSlug = areaBySlug[seg[0]] ? seg[0] : "";
    const isTeam = seg.includes("team") || seg.length > 2;
    const area = areaSlug ? areaBySlug[areaSlug] : null;
    const proj = flatProjects.find((x) => x.href === p.path);
    const t = text(p.lead || p.body);
    return {
      ...p,
      area: areaSlug,
      areaName: area?.name || "",
      areaColor: area?.color || "teal",
      isTeam,
      image: p.image || proj?.thumb || "",
      funder: p.funder || proj?.funder || "",
      group: p.group || proj?.group || "",
      status: proj?.status || "active",
      placeholder: !!p.placeholder,
      excerpt: clip(t, 200),
    };
  });

// A few project pages are image-only on the original; give them a lead.
const simple = (p) => by[p];

// ---------------------------------------------------------------- about
const ab = load(by["/about/"].body);
const people = (sel) =>
  ab(`${sel} .team-member`)
    .map((_, el) => {
      const $e = ab(el);
      return {
        name: $e.find(".item-title").text().replace(/\s+/g, " ").trim(),
        role: $e.find(".item-meta").html() || "",
        photo: $e.find("img").attr("src") || "",
        bio: $e.find(".item-summary").html() || "",
      };
    })
    .get();
const PH_HEAD = "/img/placeholder-headshot.svg";
const soon = (name, role) => ({ name, role, photo: PH_HEAD, bio: "<p>Bio coming soon.</p>", placeholder: true });
// Officer titles per the most recent Form 990 (FY2024, via ProPublica Nonprofit Explorer).
const OFFICER = { "Scott Cohen": "Secretary, Board of Trustees", "Mary Moran Perry": "Treasurer, Board of Trustees" };
const board = people("#board-members")
  .map((m) => { const k = Object.keys(OFFICER).find((n) => m.name.startsWith(n)); return k ? { ...m, role: OFFICER[k] } : m; })
  .concat(soon("Carlos Faerron", "Board of Trustees"));
const staff = [soon("Hugo Flores Navarro", "Program Manager")]
  .concat(people("#staff-members").filter((m) => !/Griffin/.test(m.name)))
  .concat([soon("Jill Kauffman", "Title to be confirmed"), soon("Jeanne Lemieur", "Title to be confirmed")]);
const aboutEntry = ab(".entry-content").first();
const aboutLead = aboutEntry.find(".highlighted-text").first().html();
const aboutPhilosophy = aboutEntry.find("h3").first().nextAll("p").first().html();
const aboutAfter = aboutEntry.find("p").filter((_, e) => /For more information on our work/.test(ab(e).text())).first().html();
const aboutFull = aboutEntry.find("p").filter((_, e) => /Haiti.s Heroes film/.test(ab(e).text())).first().html();
const aboutFullVideo = aboutEntry.find("iframe").last().attr("src");
const aboutMainVideo = aboutEntry.find("iframe").first().attr("src");

module.exports = {
  areas,
  areaBySlug,
  news,
  newsArchive,
  haf: areas.flatMap((a) => a.haf),
  allProjects: flatProjects,
  past: areas.map((a) => ({ name: a.name, color: a.color, items: a.past })),
  posts: [...allPosts.map(decorate), ...newPosts],
  newsFeatured: news.slice(0, 2),
  details,
  by,
  page: (p) => by[p],
  simple,
  about: {
    lead: aboutLead,
    philosophy: aboutPhilosophy,
    after: aboutAfter,
    full: aboutFull,
    fullVideo: aboutFullVideo,
    mainVideo: aboutMainVideo,
    board,
    staff,
  },
  search: [
    ...["/", "/about/", "/health/", "/empowerment/", "/arts-education/", "/news-updates/", "/get-involved/", "/donate/", "/contact/", "/press/"]
      .map((u) => ({ t: (by[u]?.title || u).replace(/ \| .*/, ""), u, s: "Page", x: text(by[u]?.lead || by[u]?.body).slice(0, 700) })),
    ...details.map((d) => ({ t: d.title, u: d.path, s: d.status === "past" ? "Past project" : "Project", x: text(d.lead + " " + d.body).slice(0, 900) })),
    ...[...news, ...newsArchive].map((n) => ({ t: n.title, u: n.path, s: "News", x: text(n.body).slice(0, 700) })),
  ],
};
