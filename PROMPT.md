# Portfolio Website Build Brief: Fitri Johan

You are building my personal portfolio website. Read this whole brief first, look at `/assets/reference.png`, and inspect every file in `/assets` before writing code. Only ask me questions that truly block you; for anything else, use a clearly marked `[PLACEHOLDER]` and keep going.

---

## 1. Goal

A modern, ultra-premium, luxury portfolio that impresses recruiters for **Junior Data Analyst** roles. It should feel editorial, calm, and expensive: lots of space, beautiful typography, cinematic images, and smooth scroll animations. Follow the layout and mood of `/assets/reference.png` closely, adapted to a black and deep navy palette.

---

## 2. Tech Stack and Hosting

- Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion
- Lenis for smooth scrolling
- Fonts via `next/font/google` (self-hosted, no layout shift)
- Static export for GitHub Pages: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`
- Repository: `YoHuan21.github.io` → live at `https://yohuan21.github.io` (no basePath needed)
- GitHub Actions workflow that builds and deploys to GitHub Pages on every push to `main`

### Image pipeline (images must look top quality)

Because static export disables Next.js image optimization, create a build-time script using `sharp`:

- Scan everything in `/assets` (projects and activities folders)
- Generate high-quality AVIF and WebP versions at widths 640, 1080, 1600 and 2400 (never upscale beyond the original), quality around 80–85
- Generate a tiny blurred placeholder for each image
- Strip all EXIF/GPS metadata
- Output to `/public/images/...` and write a JSON manifest (sizes, dimensions, placeholder)
- Build a reusable `<SmartImage>` component that uses `<picture>` + `srcset` + `sizes`, explicit width/height, blur-up loading, and lazy loading (except the hero, which is preloaded)
- Run this script automatically before `build` and `dev`, so when I add new photos to a folder later, they appear after a rebuild with no code changes

---

## 3. Design System

### Colors

| Token | Value | Use |
|---|---|---|
| `--bg` | `#05070D` | Page background (near-black with a navy tint) |
| `--navy-900` | `#0A1128` | Elevated sections |
| `--navy-800` | `#0F1B3D` | Cards, panels |
| `--border` | `rgba(148, 163, 184, 0.12)` | 1px hairline borders |
| `--accent` | `#3B82F6` | Electric blue, used sparingly (active states, progress lines, glows) |
| `--accent-soft` | `#93C5FD` | Ice-blue highlights, hover text |
| `--text` | `#E8ECF4` | Primary text (soft white, never pure white) |
| `--muted` | `#8B94A9` | Secondary text |

Add subtle navy/blue radial glows behind visual areas (like the teal glow in the reference, but in blue tones) and a very faint grain texture overlay for depth.

### Typography

- **Headings:** `Manrope`, weight 300–400, tight letter-spacing (`-0.02em` to `-0.03em`), large fluid sizes with `clamp()`. This matches the light, refined headings in the reference.
- **Accent words:** `Instrument Serif` *italic* for one or two key words inside headings (e.g. "I turn data into *clear decisions*"). This gives a luxury editorial feel. Use it sparingly.
- **Body:** `Inter`, weight 400, comfortable line-height (1.6–1.7), muted color.
- **Eyebrow labels:** `Manrope` uppercase, 11–12px, wide letter-spacing (`0.2em`), muted color (like "CORE CAPABILITIES" in the reference).
- **Code windows and data labels:** `JetBrains Mono`.

### Shapes and details

- Rounded corners 16–24px, 1px hairline borders, soft inner glows
- Generous whitespace, thin divider lines between list items
- White pill buttons for primary actions (as in the reference), ghost pill buttons for secondary

### Signature image treatment (important)

Large images should feel cinematic:
- Rounded corners with a soft, wide drop shadow (`0 40px 80px -20px rgba(0,0,0,0.6)`) and a faint navy glow
- A **bottom fade**: a gradient from transparent to `--bg` over the bottom 30–40% of the image, so the image melts into the page
- Text placed overlapping the faded area or right beside the image, as in the reference CTA section
- A subtle dark vignette so text on images is always readable

---

## 4. Page Structure (home page)

1. **Navbar**: thin and sticky. Name "Fitri Johan" on the left, centered links (Work, About, Activities, Skills, Contact), white pill button "Download Resume" on the right (links to the resume PDF). Transparent at the top; gains a backdrop blur and hairline border on scroll. Animated full-screen menu on mobile.

2. **Hero**: very large light-weight headline, left-aligned:
   "Hi, I'm Fitri. I turn data into *clear decisions*, and build things that connect hardware to people."
   Subline: "Final-year IT student at UiTM · Aspiring Junior Data Analyst".
   Below it, a wide cinematic image banner with the signature image treatment and a gentle parallax zoom on scroll. Use `/assets/photo.jpg`; if it is portrait-shaped, switch to a split hero (headline left, portrait right with the bottom fade) instead of forcing a wide crop. Then a short muted intro paragraph.

3. **Skills marquee**: a slow, infinite marquee of tools in varied elegant type styles (like the logo strip in the reference): Python, SQL, Power BI, pandas, Hadoop, Hive, Java, Firebase, ESP32, MySQL. Pauses on hover.

4. **Selected Work**: eyebrow "SELECTED WORK" and a large heading. Then one large bordered, rounded split card per project, like the reference's "Core capabilities" blocks:
   - One side: dark visual area with a soft blue glow and the project visual floating inside a mock window frame (dashboard, chart, code, or photo)
   - Other side: project title with an icon, a short description, and three items separated by thin lines: **Problem / What I did / Result**
   - The active item has an animated blue progress line above it; items auto-advance every ~5 seconds and are also clickable, cross-fading the content
   - Alternate the layout (visual left, then visual right) for each project
   - Each card has a "View case study →" link to a detailed project page
   - Order: Student Performance, HR Analysis, MediTap, Healthcare System

5. **About**: my photo with the signature image treatment, a short bio, and count-up stats when scrolled into view (e.g. "25,000 records analyzed", "4 projects", "Dean's List ×2").

6. **Beyond the Classroom (Activities)**: elegant cards or a vertical timeline. Each card shows the cover photo (with bottom fade), title, role, and date. Clicking opens a lightbox gallery of all photos in that event's folder. Activities without photos appear as refined text-only cards with an icon (not broken image boxes).

7. **Education**: UiTM, Bachelor of Information Technology (Hons.), Oct 2023 – Present, Dean's List (Semester 1 2023/2024, Semester 6 2026), CGPA 3.39 as a small detail.

8. **Skills**: grouped minimal cards: Programming, Data & Visualization, Big Data, Mobile & IoT, Web, Tools.

9. **CTA**: full-width rounded image background with a dark overlay and bottom fade, centered heading "Let's work *together*", and a white pill button linking to my email.

10. **Footer**: minimal. Name on the left, links in the center (LinkedIn, GitHub, Email), "© 2026 Fitri Johan" on the right.

### Case study pages (`/work/[slug]/`)

Each project gets its own page: hero image with the signature treatment, overview, my role, tech stack chips, Problem / What I did / Result in more detail, charts or visuals, an image gallery with lightbox, and "Next project →" navigation at the bottom.

---

## 5. Scroll and Transition Effects

- Lenis smooth scrolling
- Sections fade up with a slight blur-to-sharp effect via Framer Motion `whileInView` (trigger once)
- Headings reveal word by word or line by line with a stagger
- Images reveal with a clip-path wipe or a gentle scale-in, plus subtle parallax
- Cards and list items stagger in sequentially
- Hover: pill buttons lift slightly, cards gain a faint blue border glow, images zoom very slightly
- Soft fade transitions between pages
- A thin blue scroll-progress bar at the very top
- Respect `prefers-reduced-motion` (disable parallax and heavy motion)
- Animations must stay smooth (60fps): animate only `transform` and `opacity`, avoid layout thrashing

---

## 6. Content

Put all text in one editable file, `/data/content.ts`, so I can update content without touching components.

### Personal details

- Name: Fitri Johan (full name: Fitri Johan Bin Shahrul Mazli)
- Title: Final-year IT student | Aspiring Junior Data Analyst
- University: Universiti Teknologi MARA (UiTM)
- GitHub: https://github.com/YoHuan21
- LinkedIn: https://www.linkedin.com/in/fitri-johan/
- Email: [PLACEHOLDER]
- Resume: `/assets/resume.pdf` (public version) for the Download Resume button. You may read it for bio, skills and experience.

### Projects

**1. Student Performance Big Data Analysis**
Team project (4 members) · DSC650 · Hadoop, HDFS, Hive, HiveQL, Power BI
Images: `/assets/projects/student-performance/`
- Problem: Educators lacked clear evidence of which factors (attendance, study hours, study method, internet access) actually influence student results.
- What I did: Loaded a 25,000-record, 16-attribute dataset into Hadoop HDFS, built a Hive table, wrote 10 HiveQL queries (aggregations, CASE-based grouping, filtering), and visualized the results in an interactive Power BI dashboard. [PLACEHOLDER: my specific role]
- Result: Study time had the strongest effect. Average scores rose from 39.8 (under 2 hours/day) to 77.9 (over 4 hours/day). High attendance (>85%) averaged 70.4 versus 58.0 for low attendance (<70%). Internet access, school type and gender each made less than a 1-point difference. Even among students scoring 80+, Science was the most common weak subject.

**2. HR Data Analysis for Employee Retention**
Team project (5 members) · ICT550 · Python, Kaggle datasets, dashboard
Images: `/assets/projects/hr-analysis/` (may be empty)
- Problem: Companies lose good employees without understanding why, and HR teams lack data-driven tools to spot problems early.
- What I did: Used a 5 Whys root-cause analysis to frame the problem, then combined two Kaggle datasets (IBM HR Analytics Employee Attrition & Performance, and Employee Productivity & Satisfaction HR Data) to analyze attrition by department, job role, age and overtime. [PLACEHOLDER: my specific role]
- Result: Sales and Research & Development had the highest attrition, and age group, job role and overtime emerged as key factors, pointing HR teams toward workload balance and job satisfaction as retention levers.

**3. MediTap: Caregiver-Assisted IoT Medication Dispenser**
Final Year Project · Java, Android Studio, Firebase Realtime Database, ESP32, DS3231 RTC, servo motor, buzzer, push button
Images: `/assets/projects/meditap/` (may be empty)
- Problem: Caregivers need a reliable way to manage medication schedules and confirm doses are taken on time.
- What I did: Designed, developed and deployed a functional IoT medication dispenser integrated with an Android app for scheduling, notifications, user management and medication logs. Integrated ESP32, DS3231 RTC, servo motor, buzzer and push button for automated time-based dispensing and status tracking.
- Result: Completed a working prototype validated through functional testing of dispensing accuracy, compartment selection, response time and medication logging.

**4. Healthcare Equipment Management System**
Web application project · Java, JSP, Servlets, JDBC, MySQL, Apache NetBeans
Images: `/assets/projects/healthcare-system/` (may be empty)
- Problem: Healthcare equipment, maintenance and reservations are hard to track without a central system.
- What I did: Built a Java web application with login and registration, equipment and maintenance records, and reservations, using CRUD operations and JDBC database connectivity.
- Result: A working academic system demonstrating web development, database management and system flow design.

### Real data for project charts

Draw these as crisp SVG charts in the site palette (not images). Animate them drawing in on scroll.

Student Performance:
- Avg overall score by study hours (bins 0–8): 36, 41, 50, 58, 66, 73, 81, 89, 94 → line chart (the hero visual for this project)
- Avg score by attendance: High (>85%) 70.4, Medium (70–85%) 65.6, Low (<70%) 58.0 → bar chart
- Grade distribution (25,000 students): A 1,205 · B 2,696 · C 6,161 · D 6,311 · E 5,672 · F 2,955 → donut chart
- High scorers (80+) weak in a subject: Science 47 · Math 34 · English 28 → bar chart
- Stat cards: "25,000 records", "16 attributes", "10 HiveQL queries"
- The original Power BI chart images in the project folder go in the case study gallery as "Original dashboard".

Code-window card for Student Performance (real query, syntax-highlighted):

```sql
SELECT CASE
  WHEN study_hours < 2 THEN 'Low Study'
  WHEN study_hours BETWEEN 2 AND 4 THEN 'Medium Study'
  ELSE 'High Study' END AS study_level,
  AVG(overall_score) AS avg_score
FROM student_performance_final
GROUP BY CASE
  WHEN study_hours < 2 THEN 'Low Study'
  WHEN study_hours BETWEEN 2 AND 4 THEN 'Medium Study'
  ELSE 'High Study' END;
```

### Visuals for projects without images

For any project folder that is empty, generate a polished visual built with SVG/CSS as a reusable component:
- HR Analysis: a flow visual (Two datasets → Merge & clean → Analyze attrition → Dashboard) plus a code-window card
- MediTap: a system diagram (ESP32 + RTC + servo ↔ Firebase ↔ Android app) in the navy/blue palette
- Healthcare System: a mock browser window with a clean dashboard-style UI
Mark any invented UI text or code with `[PLACEHOLDER]`. Never invent metrics or results.

### Activities

Images in `/assets/activities/<folder>/`, where `cover.jpg` is the main image.

1. **World Telecommunication and Information Society Day (WTISD) 2025**. Folder: `wtisd-2025` · 17 May 2025 · Role: Participant [PLACEHOLDER: details]
2. **UiTM U-STAR**. Folder: `uitm-ustar` · Role: Volunteer · Date: [PLACEHOLDER]
3. **Academic Exco, Information Technology Club, UiTM**. Folder: `it-club-exco` (no photos yet) · Dec 2024 – Dec 2025 · Coordinated academic activities and student engagement initiatives.
4. **Faculty Representative, Modul Kepimpinan Profesional, Setiu Wetland, Terengganu**. Folder: `setiu-wetland-2024` (no photos yet) · April 2024 · Leadership programme with a group case study on community and eco-tourism.
5. **IRISE Programme**. Folder: `irise-2025` (no photos yet) · Oct 2024 – Feb 2025 · Recognised for contribution in teamwork, communication and idea development.

Activities without photos show as text-only cards now and automatically switch to photo cards once I add images and rebuild.

### Skills (grouped)

- Programming: Java, Python, C++, PHP, SQL
- Data & Visualization: pandas, NumPy, Matplotlib, Seaborn, Power BI
- Big Data: Apache Hadoop, HDFS, Apache Hive, HiveQL
- Mobile & IoT: Android Studio, ESP32, Arduino IDE
- Web: HTML, CSS, JSP, Servlets, JDBC, XAMPP
- Database: MySQL, phpMyAdmin, Firebase
- Tools: Jupyter Notebook, GitHub, VS Code, Apache NetBeans, WinSCP, Linux/Ubuntu

---

## 7. Privacy Rules (must follow)

- Use only facts from this brief and my resume. Do not invent metrics, clients or results.
- Label group projects as team projects.
- Never show teammates' names, photos or student IDs.
- Never show login commands, passwords, server addresses or credentials.
- No home address or personal phone number anywhere.
- Strip EXIF/GPS metadata from every image.

---

## 8. Responsive, Performance and Quality

- Mobile-first. Split cards stack vertically on mobile (visual on top, text below). Hero text scales with `clamp()`. Tap targets at least 44px.
- Test and fix layouts at 375px, 768px, 1024px, 1440px and 1920px.
- Target Lighthouse 95+ for performance, accessibility, best practices and SEO.
- Preload the hero image and fonts; lazy-load everything below the fold; set image dimensions to avoid layout shift.
- Semantic HTML, alt text on all images, visible focus states, good contrast.
- SEO: page titles, meta descriptions, Open Graph image, favicon (a minimal "FJ" monogram in navy and blue), `sitemap.xml`, `robots.txt`.
- Add a custom 404 page in the same style.

---

## 9. How to Work

1. Look at `/assets/reference.png` and list every file in `/assets`, then tell me your plan in a few lines.
2. Build in phases: setup and design system → image pipeline → home page sections → case study pages → animations → responsive polish → performance pass.
3. After each phase, run the dev server and fix any errors before continuing.
4. Finish with `npm run build` succeeding with zero errors.
5. Then explain, in simple steps: how to run it locally, how to edit `/data/content.ts`, how to add new photos, and how to push to GitHub so it deploys to `https://yohuan21.github.io`.
