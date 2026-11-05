const ORIGIN = "https://www.abundance.org";
// GitHub project pages are served from /<repo>/, so root-relative URLs need a prefix there.
const PREFIX = (process.env.PATH_PREFIX || "").replace(/\/$/, "");
const NOINDEX = process.env.NOINDEX === "true";

// Links inside the original copy that were already dead or used old slugs.
const LINK_FIX = {
  "/arts-education/agency-by-design/": "/arts-education/agencybydesign/",
  "/1832": "/letter-from-dr-stephen-kahn-about-urgent-covid-19-research-on-bcg-vaccine/",
  "/1298": "/abundance-foundation-funds-development-of-ebola-diagnostic-test/",
  "/health/rwanda-human-resources-for-health-program/": "/health/rwandahealth/",
  "/health/harvard-medical-school/": "/health/hms/",
  "/health/harvard-medical-school": "/health/hms/",
  "/health/partners-in-health/": "/health/pih/",
  "/health/global-health-delivery-project/": "/health/globalhealthdelivery/",
  "/health/abundance-project-for-global-health/": "/health/globalhealth/",
  "/arts-education/cine-institute/": "/arts-education/cine/",
  "/health/harvard-masters-in-global-health-delivery/": "/health/hmghd/",
  "/crucial-research-assessing-efficacy-in-preventing-covid-19-of-widely-used-vaccine-for-tuberculosis-called-bcg/": "/news-updates/",
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/img": "img", "src/fonts": "fonts", "src/css": "css", "src/js": "js", "src/favicon.png": "favicon.png", "src/apple-touch-icon.png": "apple-touch-icon.png", "src/icon-192.png": "icon-192.png" });
  eleventyConfig.addWatchTarget("src/css/");

  // Uploaded files (PDFs, zips) were never mirrored; point them at the original host.
  eleventyConfig.addTransform("legacy-uploads", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/(href|src)="\/wp-(content|includes)\//g, `$1="${ORIGIN}/wp-$2/`);
  });

  eleventyConfig.addTransform("legacy-links", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/href="(\/[^"#?]*)([^"]*)"/g, (m, p, rest) => (LINK_FIX[p] ? `href="${LINK_FIX[p]}${rest}"` : m));
  });

  eleventyConfig.addTransform("path-prefix", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    if (NOINDEX) content = content.replace("<head>", '<head>\n  <meta name="robots" content="noindex, nofollow">');
    if (!PREFIX) return content;
    return content.replace(/(href|src)="\/(?!\/)/g, `$1="${PREFIX}/`);
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
