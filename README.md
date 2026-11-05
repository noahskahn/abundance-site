# Abundance Foundation website

Static site built with [Eleventy](https://www.11ty.dev/) (Nunjucks templates, plain CSS, ~2 KB of vanilla JS).
No client framework, no runtime dependencies, self-hosted fonts (Source Sans 3 / Source Serif 4).

```bash
npm install
npm start        # dev server at http://localhost:8080
npm run build    # output in dist/
npm run check    # verify internal links in dist/
npm run import   # re-crawl abundance.org into src/_data/pages.json + src/img/c
```

- `src/_data/pages.json` – all content imported from abundance.org (the source of truth for copy)
- `src/_data/hub.js` – shapes that content for templates (areas, projects, news, people)
- `src/_data/site.js` – navigation, social links
- `src/css/site.css` – the entire design system
- Donations still go through the existing PayPal-backed form on abundance.org.
