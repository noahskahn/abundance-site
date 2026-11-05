const si = require("simple-icons");
// simple-icons dropped LinkedIn, so its glyph is inlined here.
const LINKEDIN = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

module.exports = {
  name: "Abundance Foundation",
  description: "The Abundance Foundation partners with visionaries who transform scarcity into abundance — advancing health, empowerment, arts and education worldwide.",
  nav: [
    { label: "Our Work", children: [
      { label: "Health", href: "/health/" },
      { label: "Empowerment", href: "/empowerment/" },
      { label: "Arts & Education", href: "/arts-education/" },
    ]},
    { label: "Get Involved", children: [
      { label: "Partner with Us", href: "/get-involved/" },
      { label: "Why Abundance Foundation?", href: "/why-partner/" },
      { label: "Our Partners", href: "/our-partners/" },
      { label: "Donate", href: "/donate/" },
    ]},
    { label: "About Us", children: [
      { label: "Who We Are", href: "/about/" },
      { label: "Leadership", href: "/about/#leadership" },
      { label: "Press", href: "/press/" },
    ]},
    { label: "News & Stories", href: "/news-updates/" },
    { label: "Contact", href: "/contact/" },
  ],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/AbundanceFoundation", path: si.siFacebook.path },
    { label: "X", href: "https://x.com/abundance_found", path: si.siX.path },
    { label: "Instagram", href: "https://www.instagram.com/abundancefoundation", path: si.siInstagram.path },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/abundancefoundation/", path: LINKEDIN },
  ],
};
