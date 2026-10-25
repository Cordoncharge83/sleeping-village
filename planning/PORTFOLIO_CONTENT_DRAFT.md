# Sleeping Village — portfolio content draft

Drafted 23 October 2026. Smosh Story Finder was implemented locally on 24 October with live-site screenshots and a verified public link; the other sections remain content drafts. Nothing has been published from this portfolio project.

## Introduction

**Mouadh Bondka — Software Engineer**

I build software that helps people find information, make decisions, and manage the things they care about. My experience spans Java backend development, applied AI, and complete web and desktop products.

Explore my work through the village, or open the direct portfolio for a quick overview.

Primary actions: View projects · View experience · Download CV · Get in touch.

## Featured projects

### Smosh Story Finder

**Status:** Live · Archive expanding

**Short description:** Find that Smosh Reddit story you remember.

I built a searchable archive to help Smosh viewers rediscover stories from the show. It brings individual stories into a browsable, filterable collection, making it easier to find a remembered story without revisiting whole episodes.

My work covers the browsing experience, story cards and filters, and the import workflow used to grow the archive. A central challenge is keeping the collection useful as it expands: presenting readable results and bringing new batches of stories into the published site consistently.

The site is live and has begun attracting visitors and positive feedback. I’m continuing to import stories and expand its coverage.

**Visitor action:** Explore the archive.

**Link from project history:** https://smosh-story-finder.pages.dev/

**Evidence to add when available:** A dated visitor count with its measurement period, or a short attributed feedback excerpt with permission where needed. Neither is required for the initial version.

### Comp Atlas

**Status:** In active development · Not yet publicly available

**Short description:** Research VALORANT compositions and prepare for opponents.

I’m building Comp Atlas for competitive VALORANT players, coaches, and analysts. It brings composition research, team tendencies, match records, and VOD references together so users can move from a statistic to the matches behind it.

My work spans the research interface, statistical calculations, data normalization, and the administration tools used to import and maintain match data. One central engineering challenge is turning varied match records into consistent information while retaining control over updates. The import workflow supports reviewing changes before applying them and restoring previous snapshots.

The project combines product design with data processing and ongoing work on the reliability of its publishing tools.

**Visitor action:** View the project overview and screenshots. Add Watch the walkthrough when a showcase video is available on YouTube.

**Showcase plan:** Use captioned screenshots to demonstrate composition research, team scouting, and the connection between statistics and match/VOD evidence. A short video can follow one concrete research task from start to finish. Screenshots and a YouTube video are planned materials, not existing assets. Keep the project accessible as a portfolio case study without linking visitors to the private application.

**Technical details for an expanded view:** TypeScript, React, Cloudflare D1 and R2; match-data ingestion, validation, and snapshot workflows. Confirm the current stack against the repository before final publication; earlier project notes describe earlier versions.

### DuelSync

**Status:** Desktop project; current release/download availability to verify.

**Short description:** Keep tournament operations and player updates in sync.

I built DuelSync to help Yu-Gi-Oh! tournament organizers manage an event locally and share its progress online. The desktop application monitors tournament files, synchronizes rounds and pairings, and publishes player-facing pairings, standings, and brackets.

I connected a React interface and Python backend with local SQLite storage, backup and restoration, and a separate publishing workflow. A key design challenge was deciding what should leave the organizer’s computer: public results are shared without exposing sensitive player identifiers.

The application also handles tournament details such as BYEs and configurable Top Cut seeding.

**Visitor action:** Visit the project website. Only use a Download button after confirming an available release.

**Link from CV:** https://duelsync.moudka.com/

**Technical details for an expanded view:** Tauri, React, FastAPI, SQLite, Cloudflare Workers, KV, and Pages.

### Bargainy

**Status:** Deployed project per CV; current live availability to verify.

**Short description:** Practice a difficult negotiation before the real conversation.

I built Bargainy to let people rehearse job-offer, rent, and purchase negotiations with an AI counterpart, then receive personalized feedback on their approach. A shorter Quick Coach mode offers another way to get guidance.

My work connects a React and TypeScript interface with server-side AI requests, structured responses, and error handling. One important design decision was separating information by role: the simulated counterpart receives the shared scenario, while the user’s private objectives are reserved for the final coaching analysis.

That separation makes information handling part of the product’s behavior, alongside the conversation and feedback experience.

**Visitor action:** Try a practice negotiation.

**Link from CV:** https://bargainy.moudka.com/

**Technical details for an expanded view:** React, TypeScript, Gemini API, structured outputs, fallback handling, and Spline. Avoid pinning the portfolio copy to a model version unless useful and verified.

## Professional experience

### Sopra Steria — Java Developer Intern

**April–October 2025**

I contributed Java and Spring Boot features to a large healthcare information system for CNAM. My work included investigating production incidents across business rules, SQL queries, and application code, then testing corrective changes with JUnit and Mockito. I worked with analysts, testers, and developers through production releases.

**Skills demonstrated:** Java, Spring Boot, SQL, debugging, automated testing, and delivery within an established team.

### La Banque Postale — AI Developer Intern

**May–August 2024**

I developed a desktop assistant for searching internal documentation using retrieval-augmented generation. I worked across document ingestion, vector storage, retrieval, ranking, and the user interface, and evaluated retrieval approaches before delivering the solution and technical handoff.

**Skills demonstrated:** Python, LangChain, PostgreSQL, pgvector, semantic search, and end-to-end application development.

## About and supporting information

I graduated from IMT Atlantique with an engineering degree in software engineering in 2025. Alongside my technical work, I led WAKE’s 20-member organizing committee for a student event welcoming up to 500 participants, coordinating partnerships, communication, and logistics.

I’m looking for software engineering opportunities where I can contribute to backend systems and build useful products.

**Selected skills, supported by the work above:**

- Backend and data: Java, Spring Boot, Python, FastAPI, SQL, PostgreSQL, SQLite.
- Interfaces: TypeScript, React.
- Applied AI: retrieval-augmented generation, semantic search, vector storage, AI API integration.
- Delivery and reliability: Git, automated testing, debugging, data validation, deployment.

Keep the broader skills and spoken-language list in the downloadable CV. Avoid proficiency bars or numerical skill ratings.

## Future-project area

### Manart — house-building game (codename)

**Sign:** Further development planned

Manart is the codename for a house-building game I plan to work on after completing the Smosh story imports.

**Visual direction:** Foundations, stacked timber, and a blueprint board.

**Internal note:** Use the user-selected codename Manart. Do not import features or playable-status claims from the earlier Minaret project history without confirming that they apply to Manart.

### Penguin board game — title to come

**Sign:** Early concept · Rules taking shape

A penguin board game at the idea stage, with a few initial rules taking shape. It doesn’t have a name yet, but it has a place in my future plans.

**Visual direction:** A small fenced icy corner with a board-game motif.

**Internal note:** User confirms an idea and a few initial rules, with no name yet. Keep Penguin board game as a descriptive label. Do not imply active implementation or a playable prototype. No launch date or invented mechanics.

## Content presentation

Use the same content in the direct portfolio and village. Each project initially shows its title, status, short description, and a clear action. The longer story opens on demand. Keep CV and contact actions accessible without visiting every building.

The future-project area is an optional small stop. It should not be needed to reach the featured projects or professional experience.

## Sources and remaining checks — internal only

- CV: C:/Users/mouad/Downloads/CV_Mouadh_SWE_EN.pdf. Source for the internships, education, WAKE, DuelSync, Bargainy, and their links. These are user-supplied claims, not an independent code audit.
- Current user messages: Smosh is launched with visitors and positive reactions; Comp Atlas is active but not ready for public access, with screenshots and a YouTube showcase proposed; the house-building game's codename is Manart; the unnamed penguin board game is an idea with a few initial rules. Both games belong in a future-work area.
- Comp Atlas: Resume Project Fillout (6ac75ad7-64b0-83e9-8abf-b849e3f4ba5c) and Deployment Setup (6ad269f2-a568-83ea-9dbc-459e1094485e). Avoid treating historic dataset sizes, deployment status, or proposed performance improvements as current verified results.
- Smosh: Smosh Reddit Stories Overview (6a9d5c97-ea20-83eb-b4d3-68d4811efce9) and Batch import workflow (6ad4d02a-c3b4-83ea-8f1f-4677fbe33853).
- Game context: City Planning Game Design (6abf85ea-3998-83ea-bef6-f63feb4f5e52) describes Minaret. The user has selected Manart as the portfolio codename for the house-building game; avoid carrying over historical implementation claims without confirmation.
- Comp Atlas media: screenshots and a YouTube showcase URL remain to be prepared. These are publication assets, not blockers for reviewing the content draft. No public application URL is needed at this stage.
- Automated web retrieval could not access the Smosh, Bargainy, or DuelSync websites during this drafting pass. This does not establish that they are down. Verify destinations and available visitor actions in a browser before publication.
- No audience totals, measured performance gains, customer adoption, release dates, or testimonials have been invented.
- Public wording describes product work and responsibility. It does not claim every line was hand-written or that there were no tools or collaborators. Add any contributor credits when known.
