// New 2026 content drawn from the "Program Report – Abundance Board 2026" (80-word versions).
// Items still in discussion (mental health fellowship, Tibet, Whistler funder outreach, etc.) are
// intentionally NOT published here until Stephen/Hugo confirm they are public.
const PH = "/img/placeholder-photo.svg";
const HAF = "Harvard Abundance Fund";
const AF = "Abundance Foundation";

const projects = [
  {
    path: "/health/ses-tb-lab/", title: "Socios En Salud TB Laboratory (Lima, Peru)", area: "health", funder: HAF, image: PH,
    summary: "A $1.2 million grant secures the tuberculosis laboratory in Lima, Peru, home to one of the world’s most important repositories of multidrug-resistant TB samples.",
    lead: "<p class=\"highlighted-text\">Through the Abundance Donor-Advised Fund at Harvard University, and following extensive coordination with the Department of Global Health and Social Medicine, Dr. Megan Murray, and SES Peru leadership, we secured a $1.2 million grant for the tuberculosis laboratory in Lima, Peru.</p><p>This critical funding ensures continuity of operations, supports cutting-edge research, and safeguards one of the world’s most important repositories of multidrug-resistant tuberculosis samples — an asset of global scientific significance.</p>",
  },
  {
    path: "/health/pih-communications-summit/", title: "PIH Global Communications Summit", area: "health", funder: AF, image: PH,
    summary: "A $50,000 grant to Partners In Health supports its first Global Communications Summit, bringing communications leaders from PIH sites together.",
    lead: "<p class=\"highlighted-text\">Abundance provided a $50,000 grant to Partners In Health to support its first Global Communications Summit, bringing together communications leaders from PIH sites around the world.</p><p>The gathering is designed to foster cross-site learning — an important strength of the PIH model — while developing a coordinated long-term content strategy. By strengthening local storytelling capacity, the initiative will help PIH teams more effectively communicate the impact of their lifesaving work, share lessons across countries, and ensure that powerful local experiences inform the organization’s broader narrative.</p>",
  },
  {
    path: "/health/liberia-family-medicine/", title: "Liberia: Family Medicine Residency & Better Evidence", area: "health", funder: AF, image: PH,
    summary: "Supporting the family medicine residency in Maryland County, Liberia, and exploring AI-enabled clinical decision support with Better Evidence.",
    lead: "<p class=\"highlighted-text\">In his role as a Partners In Health trustee, Stephen Kahn visited PIH’s operations in Liberia and toured the PIH-supported hospital in Maryland County, a remote and underserved region.</p><p>Particular attention was given to the innovative family medicine residency program, which is addressing Liberia’s critical shortage of trained specialists by building a sustainable, locally rooted workforce.</p><h3>Better Evidence</h3><p>Following engagement with Dr. Gueilledana Paul, leader of the residency program, we identified a critical gap in clinical supervision and training. In response, we initiated collaboration with Dr. Rebecca Weintraub of the Better Evidence initiative at Brigham and Women’s Hospital. Together, we are exploring AI-enabled clinical decision support tools to augment limited in-person supervision, enhance training quality, and improve patient care in resource-constrained settings. We are also supporting stipends for medical students.</p>",
  },
  {
    path: "/health/companeros-en-salud/", title: "Compañeros En Salud (Chiapas, Mexico)", area: "health", funder: AF, image: PH,
    summary: "Strengthening Compañeros En Salud as it transitions to full organizational independence, with a focus on maternal health, community health workers and mental health.",
    lead: "<p class=\"highlighted-text\">During a visit to Chiapas, Stephen Kahn and Hugo Flores spent a weekend in Jaltenango with the Compañeros En Salud (CES) team, strengthening relationships and advancing strategic alignment.</p><p>They toured a community hospital and a maternal waiting home supported by CES, both critical to improving rural access to care. Meetings with Mariana Montaño, the incoming Executive Director, centered on leadership transition, institutional sustainability, and programmatic priorities spanning maternal health, community health workers, mental health, and the right to healthcare. Abundance also sponsored professional storytelling training for Mariana. Stephen continues to serve on a Partners In Health board subcommittee guiding CES’s transition to full organizational independence.</p>",
  },
  {
    path: "/health/us-global-health-spending-watch/", title: "U.S. Global Health Spending Watch", area: "health", funder: AF, image: PH,
    summary: "Helping institutionalize a tracker of U.S. government global health funding used by policymakers, journalists and advocates.",
    lead: "<p class=\"highlighted-text\">Abundance is supporting the institutionalization of the U.S. Global Health Spending Watch, launched by KJ Seung, Margaret Bourdeaux, and Vincent Lin, which tracks U.S. government global health funding from Congressional appropriations through agency obligations and implementation.</p><p>The platform has quickly become a resource for policymakers, journalists, and advocates, documenting major shifts and disruptions in global health financing. Abundance is helping the team establish the initiative within Harvard and identify funding to sustain and expand the project through 2027.</p>",
  },
  {
    path: "/health/surgical-commission/", title: "Commission for the Transformation of Surgical Services", area: "health", funder: AF, image: PH,
    summary: "Sixteen research groups completed data collection and analysis ahead of the Commission’s final report and a new model for surgical care.",
    lead: "<p class=\"highlighted-text\">During the year, the 16 research groups participating in the Commission for the Transformation of Surgical Services completed data collection and analysis in preparation for the final report.</p><p>The Commission’s expected deliverables include a patient-centered diagnostic assessment; a Transformation Agenda outlining priority interventions, implementation phases, responsibilities, and key results; and a new model for surgical care. The work will also establish an internal governance mechanism to monitor implementation and support sustained progress toward more accessible, coordinated, and patient-centered surgical services.</p>",
  },
  {
    path: "/arts-education/slow-storytelling-lab/", title: "Slow Storytelling Lab", area: "arts-education", funder: AF, image: PH,
    summary: "A workshop-based lab, growing out of the Out of Eden Walk, training emerging journalists in deep, place-based reporting. Supported by a $25,000 grant.",
    lead: "<p class=\"highlighted-text\">Building on the legacy of Paul Salopek’s Out of Eden Walk, we have developed the Slow Storytelling Lab, an immersive, workshop-based initiative to train emerging journalists and storytellers, particularly in under-resourced communities and “news deserts” across the United States.</p><p>The program emphasizes deep, place-based reporting grounded in trust, consent, and long-term engagement — countering extractive models of journalism. Early conversations with members of Forward Global have generated strong interest in supporting this initiative as a model for ethical, community-centered storytelling. Abundance provided a $25,000 grant for this project.</p>",
  },
  {
    path: "/empowerment/adi-canaan/", title: "ADI Canaán (Costa Rica)", area: "empowerment", funder: AF, group: "Costa Rica", image: PH,
    summary: "A $5,000 grant supports a community-built multipurpose hall near Chirripó National Park.",
    lead: "<p class=\"highlighted-text\">Abundance provided a $5,000 grant to ADI Canaán, a community-led association in the mountains of Costa Rica near Chirripó National Park, to support construction of a multipurpose community hall.</p><p>The 600-square-meter facility is being built largely through local fundraising, donated labor, and community contributions. Once completed, it will provide a permanent gathering space for sports, cultural events, celebrations, meetings, school activities, youth programs, and other community initiatives — serving residents of all ages and strengthening the social fabric of the Los Ángeles community.</p>",
  },
  {
    path: "/empowerment/osa-conservation/", title: "Osa Conservation Project (Biriteca Agroecológica & Raising Coral)", area: "empowerment", funder: AF, group: "Costa Rica", image: PH,
    summary: "A conservation initiative on the Osa Peninsula with Biriteca Agroecológica and Raising Coral; an initial $10,000 grant supported their annual women’s gathering.",
    lead: "<p class=\"highlighted-text\">We continue to advance plans for a conservation initiative on the Osa Peninsula, one of the most biodiverse regions on the planet.</p><p>Biriteca Agroecológica is being engaged as a potential fund administrator, and Raising Coral — led by Dr. Joanie Kleypas, with deep expertise in marine conservation and reef restoration — is being explored as another partner implementer. Abundance provided an initial grant of $10,000 to Raising Coral and Biriteca to host their annual women’s gathering.</p>",
  },
];

// 2026 news items (short, from the board report)
const news = [
  { path: "/2026/ses-tb-lab-grant/", title: "$1.2 million secured for the tuberculosis laboratory in Lima, Peru", link: "/health/ses-tb-lab/", cat: "2026 Update" },
  { path: "/2026/slow-storytelling-lab/", title: "Slow Storytelling Lab: training journalists in “news deserts”", link: "/arts-education/slow-storytelling-lab/", cat: "2026 Update" },
  { path: "/2026/pih-communications-summit/", title: "Abundance supports PIH’s first Global Communications Summit", link: "/health/pih-communications-summit/", cat: "2026 Update" },
  { path: "/2026/liberia-visit/", title: "Liberia: building a local family medicine workforce", link: "/health/liberia-family-medicine/", cat: "2026 Update" },
  { path: "/2026/sierra-leone-maternal-center/", title: "Sierra Leone: visiting PIH’s new Maternal Center of Excellence", cat: "2026 Update",
    body: "<p>Stephen Kahn traveled to Sierra Leone alongside a delegation of Partners In Health board members and supporters to visit the newly inaugurated Maternal Center of Excellence. This flagship, 120-bed facility represents one of PIH’s most ambitious investments in maternal and neonatal care. Equipped with integrated electronic medical systems and designed for high-quality, respectful care, the center is poised to significantly reduce mortality and morbidity in a country with one of the highest maternal mortality rates globally, while also serving as a national training hub.</p>" },
  { path: "/2026/chiapas-retreat/", title: "Chiapas: strategic retreat with Global Pediatric Alliance and a visit with Compañeros En Salud", cat: "2026 Update", link: "/health/companeros-en-salud/",
    body: "<p>The Abundance team — Scott Cohen, Stephen Kahn, and Hugo Flores — joined the Global Pediatric Alliance leadership for a weeklong strategic retreat at their headquarters in San Cristóbal de las Casas, Chiapas, Mexico. Discussions focused on programmatic growth, long-term fundraising strategy, and deepening partnerships across the region. A field visit to rural communities highlighted the transformative impact of clean cookstove installations, which significantly reduce indoor air pollution and respiratory risk for women and children — an intervention with both immediate health benefits and long-term environmental implications.</p>" },
  { path: "/2026/adi-canaan-grant/", title: "$5,000 grant helps build a community hall in Costa Rica", link: "/empowerment/adi-canaan/", cat: "2026 Update" },
  { path: "/2026/us-global-health-spending-watch/", title: "Supporting the U.S. Global Health Spending Watch", link: "/health/us-global-health-spending-watch/", cat: "2026 Update" },
];

module.exports = { projects, news, PH, HAF, AF };
