// One-off importer: pulls every page listed in the WordPress sitemaps from
// abundance.org, extracts the main content, localises images and writes
// src/_data/pages.json so Eleventy can render everything with the new design.
import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ORIGIN = "https://www.abundance.org";
const UA = { "User-Agent": "Mozilla/5.0" };
const OUT_IMG = "src/img/c";
fs.mkdirSync(OUT_IMG, { recursive: true });

const get = async (url) => {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(url + " " + r.status);
  return r;
};

const locs = async (u) =>
  [...(await (await get(u)).text()).matchAll(/<loc>([^<]+)/g)].map((m) => m[1]);

const postUrls = await locs(`${ORIGIN}/wp-sitemap-posts-post-1.xml`);
const pageUrls = await locs(`${ORIGIN}/wp-sitemap-posts-page-1.xml`);
const postSet = new Set(postUrls);
const all = [...new Set([...postUrls, ...pageUrls])].filter(
  (u) => new URL(u).pathname !== "/videoseries/"
);

const imgCache = new Map();
async function localise(src) {
  if (!/^https?:\/\/(www\.)?abundance\.org\/wp-content\//.test(src)) return src;
  if (imgCache.has(src)) return imgCache.get(src);
  // prefer the full-size original over the WP resized variant
  const full = src.replace(/-\d+x\d+(\.\w+)$/, "$1");
  const name = path.basename(new URL(full).pathname).toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  const dest = path.join(OUT_IMG, name);
  try {
    if (!fs.existsSync(dest)) {
      let r;
      try { r = await get(full); } catch { r = await get(src); }
      fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    }
    const out = "/img/c/" + name;
    imgCache.set(src, out);
    return out;
  } catch (e) {
    console.warn("img fail", src);
    return src;
  }
}

const rel = (href) => {
  try {
    const u = new URL(href, ORIGIN);
    if (/(^|\.)abundance\.org$/.test(u.hostname)) return u.pathname + u.search + u.hash;
  } catch {}
  return href;
};

const pages = [];
const seen = new Set();
for (const url of all) {
  let html, p;
  try { const r = await get(url); html = await r.text(); p = new URL(r.url).pathname; } catch (e) { console.warn("skip", url); continue; }
  if (seen.has(p)) continue;
  seen.add(p);
  const $ = cheerio.load(html);
  const content = $("#content").first();
  if (!content.length) { console.warn("no content", url); continue; }

  const title = (content.find("h1").first().text() || $("title").text().split("|")[0]).trim();
  const cat = (content.find("article").first().attr("class") || "").match(/category-([\w-]+)/)?.[1] || "";
  const impactMatch = (content.attr("class") || "").match(/impact-border-color-(\d+)/);
  const area = { 9: "empowerment", 11: "arts-education", 13: "health" }[impactMatch?.[1]] || "";

  const body = content.clone();
  body.find("h1, script, style, noscript, .clear, .error_msg, form, .entry-meta, .hidden").remove();
  // the lead summary goes separately
  const summary = body.find(".project-summary").first();
  let lead = "";
  if (summary.length) { lead = summary.html(); summary.remove(); }

  for (const el of body.find("img").toArray()) {
    const $el = $(el);
    $el.attr("src", await localise($el.attr("src")));
    $el.removeAttr("srcset").removeAttr("sizes").removeAttr("width").removeAttr("height").removeAttr("class").removeAttr("style");
    $el.attr("loading", "lazy");
  }
  const clean = ($root) => {
    $root.find("a[href]").each((_, a) => {
      $(a).attr("href", rel($(a).attr("href")));
    });
    $root.find("[style]").removeAttr("style");
    $root.find("iframe").each((_, f) => {
      $(f).removeAttr("width").removeAttr("height").removeAttr("frameborder").attr("loading", "lazy");
    });
  };
  clean(body);
  const leadC = cheerio.load(`<div id="x">${lead}</div>`, null, false);
  if (lead) {
    for (const el of leadC("#x img").toArray()) {
      const $el = leadC(el);
      $el.attr("src", await localise($el.attr("src")));
      $el.removeAttr("srcset").removeAttr("sizes").removeAttr("width").removeAttr("height").removeAttr("class").removeAttr("style");
      $el.attr("loading", "lazy");
    }
    clean(leadC("#x"));
    lead = leadC("#x").html();
  }

  const og = $('meta[property="og:image"]').attr("content") || "";
  const thumb = content.find("img").first().attr("src") || "";
  pages.push({
    path: p,
    title,
    kind: postSet.has(url) || postSet.has(ORIGIN + p) ? "post" : "page",
    category: cat,
    area,
    lead,
    body: body.html().replace(/\n\s*\n+/g, "\n").trim(),
    og,
    thumb,
  });
  console.log("ok", p);
}

fs.writeFileSync("src/_data/pages.json", JSON.stringify(pages, null, 1));
console.log(pages.length, "pages");
