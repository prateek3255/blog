/**
 * OG Image Generator
 *
 * Generates 1200x630 PNG open graph images for every blog post using Satori.
 * Runs before `astro build` via the `build` npm script.
 *
 * Usage: node scripts/generate-og.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Paths ────────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'blog');
const OUTPUT_DIR = path.join(ROOT, 'public', 'og', 'blog');
const FONTS_DIR = path.join(ROOT, 'public', 'fonts');

// ─── Fonts & assets ───────────────────────────────────────────────────────────

const frauncesSemiBold = fs.readFileSync(
  path.join(FONTS_DIR, 'fraunces-semibold.ttf')
);
const interRegular = fs.readFileSync(
  path.join(FONTS_DIR, 'inter-regular.ttf')
);

// Grain tile — tiled over the final PNG via sharp composite for a subtle texture
const grainTile = fs.readFileSync(path.join(FONTS_DIR, 'grain.png'));

const FONTS = [
  {
    name: 'Fraunces',
    data: frauncesSemiBold,
    weight: 600,
    style: 'normal',
  },
  {
    name: 'Inter',
    data: interRegular,
    weight: 400,
    style: 'normal',
  },
];

// ─── Frontmatter parser ───────────────────────────────────────────────────────

/**
 * Minimal frontmatter extractor — reads the YAML block between the first pair
 * of `---` delimiters and pulls out `title`.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];

  // title: "..." or title: ...
  const titleMatch = yaml.match(/^title:\s*["']?(.+?)["']?\s*$/m);

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
  };
}

// ─── OG template ─────────────────────────────────────────────────────────────

/**
 * Returns a Satori-compatible React-element-like object for the OG image.
 */
function buildTemplate(title) {
  const fontSize = title.length > 50 ? '48px' : '56px';

  // Outer: full canvas background
  // Inner: bordered inset card using padding + flexbox (no absolute positioning)
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        backgroundColor: '#fafafa',
        padding: '20px',
      },
      children: [
        // Inset bordered card — takes all available space
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #c8c8c8',
              borderRadius: '12px',
              padding: '60px 28px 28px 28px',
            },
            children: [
              // Title — grows to fill available vertical space
              {
                type: 'div',
                props: {
                  style: {
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: '828px',
                  },
                  children: [
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'Fraunces',
                          fontWeight: 600,
                          fontSize,
                          lineHeight: 1.2,
                          color: '#1a1a1a',
                          textAlign: 'center',
                          margin: 0,
                          padding: 0,
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },
              // Bottom row: URL label aligned right
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                  },
                  children: [
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '18px',
                          color: '#9a9a9a',
                          margin: 0,
                          padding: 0,
                        },
                        children: 'prateeksurana.me',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ─── Generator ────────────────────────────────────────────────────────────────

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const GRAIN_W = 400; // grain.png tile width  (1200 / 400 = 3 tiles across)
const GRAIN_H = 210; // grain.png tile height (630  / 210 = 3 tiles down)

/**
 * Build a tiled composite array for sharp from the grain tile.
 * Covers the full 1200x630 canvas by repeating the 200x200 tile.
 */
function buildGrainComposites() {
  const composites = [];
  for (let y = 0; y < OG_HEIGHT; y += GRAIN_H) {
    for (let x = 0; x < OG_WIDTH; x += GRAIN_W) {
      composites.push({
        input: grainTile,
        left: x,
        top: y,
        blend: 'over',
      });
    }
  }
  return composites;
}

const GRAIN_COMPOSITES = buildGrainComposites();

async function generateOgImage(title, outputPath) {
  const svg = await satori(buildTemplate(title), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: FONTS,
  });

  await sharp(Buffer.from(svg))
    .composite(GRAIN_COMPOSITES)
    .png()
    .toFile(outputPath);
}

// ─── Default OG template (og.png) ────────────────────────────────────────────

function buildDefaultTemplate(name, description) {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        backgroundColor: '#fafafa',
        padding: '20px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              border: '1.5px solid #c8c8c8',
              borderRadius: '12px',
              padding: '60px 28px 28px 80px',
            },
            children: [
              // Name + description grouped together, centered vertically
              {
                type: 'div',
                props: {
                  style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  },
                  children: [
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'Fraunces',
                          fontWeight: 600,
                          fontSize: '72px',
                          lineHeight: 1.1,
                          color: '#1a1a1a',
                          margin: '0 0 20px 0',
                          padding: 0,
                        },
                        children: name,
                      },
                    },
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '24px',
                          lineHeight: 1.5,
                          color: '#6a6a6a',
                          margin: 0,
                          padding: 0,
                          maxWidth: '780px',
                        },
                        children: description,
                      },
                    },
                  ],
                },
              },
              // Bottom row: URL label aligned right
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                  },
                  children: [
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '18px',
                          color: '#9a9a9a',
                          margin: 0,
                          padding: 0,
                        },
                        children: 'prateeksurana.me',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function generateDefaultOgImage(outputPath) {
  const name = 'Prateek Surana';
  const description =
    'I am a FullStack Engineer currently building Fold. I love building stuff from scratch and writing about what I learn along the way, usually related to Go, JavaScript, React, and TypeScript';

  const svg = await satori(buildDefaultTemplate(name, description), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: FONTS,
  });

  await sharp(Buffer.from(svg))
    .composite(GRAIN_COMPOSITES)
    .png()
    .toFile(outputPath);
}

async function main() {
  // Ensure output directories exist
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'public', 'og'), { recursive: true });

  // ── Default OG image ──────────────────────────────────────────────────────
  const defaultOgPath = path.join(ROOT, 'public', 'og', 'og.png');
  process.stdout.write('  Generating: default og.png...');
  await generateDefaultOgImage(defaultOgPath);
  process.stdout.write(' done\n');

  // ── Blog post OG images ───────────────────────────────────────────────────
  const postDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log(`\nGenerating OG images for ${postDirs.length} posts...\n`);

  let generated = 0;
  let skipped = 0;

  for (const slug of postDirs) {
    const mdxPath = path.join(CONTENT_DIR, slug, 'index.mdx');

    if (!fs.existsSync(mdxPath)) {
      console.warn(`  [skip] ${slug} — no index.mdx found`);
      skipped++;
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${slug}.png`);
    const content = fs.readFileSync(mdxPath, 'utf-8');
    const { title } = parseFrontmatter(content);

    if (!title) {
      console.warn(`  [skip] ${slug} — could not parse title`);
      skipped++;
      continue;
    }

    process.stdout.write(`  Generating: ${slug}...`);
    await generateOgImage(title, outputPath);
    process.stdout.write(' done\n');
    generated++;
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}\n`);
}

main().catch((err) => {
  console.error('\nOG image generation failed:', err);
  process.exit(1);
});
