/**
 * Generates illustrative placeholder imagery (PNG) for the demo.
 * Every image carries a visible "placeholder" caption so it is never
 * mistaken for client photography. Run: npm run placeholders
 */
import { mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "media");

const W = {
  hero: [2400, 1100],
  wide: [1600, 900],
  tile: [1200, 900],
  card: [800, 600],
  og: [1200, 630],
};

const PALETTES = {
  navy: { bg: "#0E1E4B", deep: "#0A1536", accent: "#18A94A", dots: ["#7B5CFF", "#FF8A3D", "#FFD23F", "#18A94A"] },
  teal: { bg: "#142F3A", deep: "#0E222B", accent: "#2DD4A7", dots: ["#7B5CFF", "#FF8A3D", "#FFD23F", "#2DD4A7"] },
  bone: { bg: "#E9EBE7", deep: "#DCE0DA", accent: "#102A72", dots: ["#7B5CFF", "#FF8A3D", "#FFD23F", "#18A94A"] },
  slate: { bg: "#1B2436", deep: "#121A28", accent: "#FF8A3D", dots: ["#7B5CFF", "#FFD23F", "#18A94A", "#2DD4A7"] },
};

function molecule(cx, cy, r, color, opacity = 1) {
  const links = [];
  const nodes = [];
  const pts = [
    [cx, cy],
    [cx - r * 1.6, cy - r * 0.9],
    [cx + r * 1.7, cy - r * 0.7],
    [cx + r * 0.4, cy + r * 1.8],
    [cx - r * 1.2, cy + r * 1.4],
  ];
  for (let i = 1; i < pts.length; i++) {
    links.push(
      `<line x1="${pts[0][0]}" y1="${pts[0][1]}" x2="${pts[i][0]}" y2="${pts[i][1]}" stroke="${color}" stroke-width="2" opacity="${opacity * 0.5}"/>`,
    );
  }
  pts.forEach(([x, y], i) => {
    nodes.push(
      `<circle cx="${x}" cy="${y}" r="${i === 0 ? r : r * 0.6}" fill="${color}" opacity="${opacity}"/>`,
    );
  });
  return `<g>${links.join("")}${nodes.join("")}</g>`;
}

function esc(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function scene({ w, h, palette, seed, label }) {
  const p = PALETTES[palette];
  const rand = mulberry(seed);
  const dots = [];
  for (let i = 0; i < 7; i++) {
    const color = p.dots[i % p.dots.length];
    dots.push(
      molecule(
        Math.round(rand() * w),
        Math.round(rand() * h),
        Math.round(14 + rand() * 34),
        color,
        0.16 + rand() * 0.2,
      ),
    );
  }
  const pellets = [];
  for (let i = 0; i < 46; i++) {
    const x = Math.round(rand() * w);
    const y = Math.round(h * 0.55 + rand() * h * 0.45);
    const r = Math.round(6 + rand() * 14);
    const color = p.dots[Math.floor(rand() * p.dots.length)];
    pellets.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${0.25 + rand() * 0.35}"/>`);
  }
  const lines = [];
  for (let i = 0; i < 8; i++) {
    const y = Math.round((h / 8) * i + 20);
    lines.push(
      `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${p.accent}" stroke-width="1" opacity="0.06"/>`,
    );
  }

  const fs = Math.max(22, Math.round(w / 46));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.deep}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.75" cy="0.3" r="0.8">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${lines.join("")}
  ${dots.join("")}
  ${pellets.join("")}
  <rect x="0" y="${h - Math.round(h * 0.16)}" width="${w}" height="${Math.round(h * 0.16)}" fill="${p.deep}" opacity="0.55"/>
  <text x="${Math.round(w * 0.045)}" y="${h - Math.round(h * 0.055)}" font-family="Segoe UI, Arial, sans-serif" font-size="${fs}" fill="#F5F5F1" opacity="0.85">${esc(label)}</text>
  <text x="${Math.round(w * 0.045)}" y="${h - Math.round(h * 0.055) - fs * 1.5}" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(fs * 0.72)}" fill="${p.accent}" letter-spacing="4">PLACEHOLDER</text>
</svg>`;
}

function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const jobs = [
  ["hero-poster.png", W.hero, "navy", 11, "Hero visual — replace with industrial film poster"],
  ["intro.png", W.tile, "bone", 21, "Company introduction — replace with factory photograph"],
  ["quality.png", W.tile, "teal", 31, "Laboratory testing — replace with lab photograph"],
  ["og-image.png", W.og, "navy", 41, "Daman Plastics — social preview"],
  ["material-1.png", W.card, "navy", 51, "Material card — engineering thermoplastic"],
  ["material-2.png", W.card, "slate", 52, "Material card — impact modified grade"],
  ["material-3.png", W.card, "teal", 53, "Material card — reinforced compound"],
  ["material-4.png", W.card, "bone", 54, "Material card — general purpose grade"],
  ["material-5.png", W.card, "slate", 55, "Material card — heat stabilised grade"],
  ["material-6.png", W.card, "navy", 56, "Material card — custom formulation"],
  ["application-1.png", W.wide, "slate", 61, "Application — automotive components"],
  ["application-2.png", W.tile, "navy", 62, "Application — consumer products"],
  ["application-3.png", W.tile, "teal", 63, "Application — electrical & electronics"],
  ["application-4.png", W.tile, "bone", 64, "Application — industrial components"],
  ["application-5.png", W.tile, "slate", 65, "Application — packaging"],
  ["manufacturing.png", W.wide, "navy", 71, "Manufacturing line — replace with plant photography"],
];

await mkdir(outDir, { recursive: true });

for (const [name, [w, h], palette, seed, label] of jobs) {
  const svg = scene({ w, h, palette, seed, label });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, name));
  console.log(`[placeholders] ${name} (${w}x${h})`);
}

/* Remove any stale placeholder files no longer in the job list. */
const keep = new Set(jobs.map(([n]) => n));
for (const file of await readdir(outDir)) {
  if (file.endsWith(".png") && !keep.has(file)) {
    await unlink(path.join(outDir, file));
    console.log(`[placeholders] removed stale ${file}`);
  }
}
console.log("[placeholders] done");
