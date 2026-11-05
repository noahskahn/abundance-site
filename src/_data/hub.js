// Shapes the raw crawl (pages.json) into the structures the templates use.
const cheerio = require("cheerio");
const pages = require("./pages.json");

const by = Object.fromEntries(pages.map((p) => [p.path, p]));
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
  return { ...a, path: pg.path, intro, introText: text(intro), projects };
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

const allPosts = pages.filter((p) => p.kind === "post");
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
const news = allPosts
  .filter((p) => p.category !== "get-involved" && p.path !== "/why-partner/" && p.path !== "/our-partners/" && p.path !== "/impact-abundance-project-for-global-health/")
  .sort((a, b) => rank(a) - rank(b) || 0)
  .map(decorate);

// -------------------------------------------------------------- detail pages
const RESERVED = new Set([
  "/", "/about/", "/news-updates/", "/contact/", "/donate/", "/press/", "/get-involved/",
  "/privacy/", "/refundpolicy/", "/donate-2/", "/staff/", "/staff-member/",
  ...AREAS.map((a) => `/${a.slug}/`),
]);
const details = pages
  .filter((p) => p.kind === "page" && !RESERVED.has(p.path))
  .map((p) => {
    const seg = p.path.split("/").filter(Boolean);
    const areaSlug = areaBySlug[seg[0]] ? seg[0] : "";
    const isTeam = seg.includes("team") || seg.length > 2;
    const area = areaSlug ? areaBySlug[areaSlug] : null;
    const proj = area?.projects.find((x) => x.href === p.path);
    const t = text(p.lead || p.body);
    return {
      ...p,
      area: areaSlug,
      areaName: area?.name || "",
      areaColor: area?.color || "teal",
      isTeam,
      image: proj?.thumb || "",
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
  posts: allPosts.map(decorate),
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
    board: people("#board-members"),
    staff: people("#staff-members"),
  },
  stats: { projects: areas.reduce((n, a) => n + a.projects.length, 0) },
};
