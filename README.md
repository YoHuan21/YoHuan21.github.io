# Fitri Johan · Portfolio

Personal portfolio for Junior Data Analyst roles. Live at **https://yohuan21.github.io**.

Built with Next.js (App Router, static export), TypeScript, Tailwind CSS, Framer Motion and Lenis.

## Run it locally

```bash
npm install        # first time only
npm run dev        # http://localhost:3000
npm run build      # production build into ./out
npm run preview    # serve ./out locally
```

`npm run dev` and `npm run build` first run the image pipeline automatically.

## Edit the text

All words on the site live in **`data/content.ts`**: name, links, hero, projects, activities, education and skills.

- Wrap a word in `*asterisks*` inside a heading to set it in the italic serif: `"Let's work *together*"`.
- Anything written as `[PLACEHOLDER …]` shows with a dashed yellow outline until you replace it.

## Add photos

1. Drop `.jpg`, `.jpeg`, `.png` or `.webp` files into a folder under `assets/`:
   - Activities: `assets/activities/<folder>/`. Name the main photo `cover.jpg`.
   - Projects: `assets/projects/<folder>/`. These photos appear in the case study gallery.
2. Run `npm run dev` or `npm run build`.

The script `scripts/build-images.mjs` creates AVIF and WebP versions at 640, 1080, 1600 and 2400px, never wider than the original. It also makes blur placeholders and strips EXIF/GPS data. Output goes to `public/images/`.

An activity with no photos shows as a text card. Once you add photos and rebuild, it switches to a photo card with a gallery.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `./out` to GitHub Pages.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Privacy notes

- PDFs in `assets/projects/` are ignored by git (see `.gitignore`), so reports and slides containing teammates' names or IDs are never published.
- Files in `assets/` are committed as they are. The website only serves the cleaned copies, but the raw files are visible in a public repo. Strip location data from phone photos before you commit them. The image script warns you if it finds GPS data.
