// Verifies every internal href/src in dist/ resolves to a built file.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const DIST = "dist";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(DIST);
const exists = (u) => {
  const p = decodeURIComponent(u.split("#")[0].split("?")[0]);
  if (!p || p === "/") return true;
  const f = path.join(DIST, p);
  return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, "index.html")));
};
const missing = new Map();
for (const f of files.filter((f) => f.endsWith(".html"))) {
  const $ = cheerio.load(fs.readFileSync(f, "utf8"));
  $("[href],[src]").each((_, el) => {
    const u = $(el).attr("href") ?? $(el).attr("src");
    if (!u || !u.startsWith("/") || u.startsWith("//")) return;
    if (!exists(u)) {
      const k = u.split("#")[0];
      if (!missing.has(k)) missing.set(k, new Set());
      missing.get(k).add("/" + path.relative(DIST, path.dirname(f)));
    }
  });
}
for (const [u, from] of missing) console.log(u, "<-", [...from].slice(0, 3).join(", "));
console.log(missing.size ? `${missing.size} broken` : "all internal links ok");
process.exitCode = missing.size ? 1 : 0;
