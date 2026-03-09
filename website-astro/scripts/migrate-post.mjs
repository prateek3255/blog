#!/usr/bin/env node
/**
 * migrate-post.mjs
 *
 * Converts a single Eleventy blog post (src/blog/<slug>.md) into an Astro MDX
 * post (website-astro/src/content/blog/<slug>/index.mdx) and copies all
 * referenced images into the correct destinations:
 *   - non-GIF images  →  website-astro/src/content/blog/<slug>/<file>
 *   - GIF images      →  website-astro/public/images/<slug>/<file>
 *
 * Usage:
 *   node website-astro/scripts/migrate-post.mjs <slug>
 *   node website-astro/scripts/migrate-post.mjs when-should-you-memoize-in-react
 *
 * Run from repo root.
 */

import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const REPO_ROOT = path.resolve(process.cwd());
const SRC_BLOG = path.join(REPO_ROOT, 'src', 'blog');
const SRC_IMG = path.join(REPO_ROOT, 'src', 'img');
const ASTRO_CONTENT_BLOG = path.join(REPO_ROOT, 'website-astro', 'src', 'content', 'blog');
const ASTRO_PUBLIC_IMAGES = path.join(REPO_ROOT, 'website-astro', 'public', 'images');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse YAML-ish frontmatter block (simple key:value, list items, quoted strings) */
function parseFrontmatter(fmText) {
  const result = {};
  const lines = fmText.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // List item under a key
    const listMatch = line.match(/^  - (.+)$/);
    if (listMatch && result.__lastKey) {
      if (!Array.isArray(result[result.__lastKey])) {
        result[result.__lastKey] = [];
      }
      result[result.__lastKey].push(listMatch[1].trim());
      i++;
      continue;
    }
    // key: value
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)?$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const val = kvMatch[2]?.trim() ?? '';
      // Strip surrounding quotes if present
      result[key] = val.replace(/^["'](.*)["']$/, '$1');
      result.__lastKey = key;
    } else {
      result.__lastKey = null;
    }
    i++;
  }
  delete result.__lastKey;
  return result;
}

/** Build the MDX frontmatter string from the parsed object */
function buildFrontmatter(fm) {
  const lines = ['---'];
  // title — always quote to be safe
  lines.push(`title: "${fm.title.replace(/"/g, '\\"')}"`);
  // description
  if (fm.description) {
    lines.push(`description: "${fm.description.replace(/"/g, '\\"')}"`);
  }
  // date — quote to keep as string (bare YYYY-MM-DD is parsed as Date by YAML)
  lines.push(`date: "${fm.date}"`);
  // updatedAt
  if (fm.updatedAt) {
    lines.push(`updatedAt: "${fm.updatedAt}"`);
  }
  // tags
  if (Array.isArray(fm.tags) && fm.tags.length > 0) {
    lines.push('tags:');
    fm.tags.forEach(t => lines.push(`  - ${t}`));
  }
  // canonical (cross-post)
  if (fm.canonical) {
    lines.push(`canonical: "${fm.canonical}"`);
  }
  lines.push('---');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Image tracking — we collect all referenced images as we process the body
// ---------------------------------------------------------------------------
/** Returns { varName, importLine, mdxTag } for a non-GIF image */
function nonGifImageInfo(filename, varIndex, slug) {
  const ext = path.extname(filename).slice(1);
  const base = path.basename(filename, path.extname(filename));
  // sanitise base name into a valid JS identifier
  const varName = `img${varIndex}_${base.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const importLine = `import ${varName} from './${filename}';`;
  return { varName, importLine };
}

/** Returns src path for a GIF (served from public/) */
function gifSrcPath(filename, slug) {
  return `/images/${slug}/${filename}`;
}

// ---------------------------------------------------------------------------
// Shortcode converters
// ---------------------------------------------------------------------------

/**
 * Convert {% headingWithLink "Text"[, "hN"][, "custom-slug"] %}
 * → plain markdown heading (## Text, ### Text, etc.)
 * Custom slug is dropped — Astro auto-slugifies from the text.
 */
function convertHeadingWithLink(args) {
  const parts = splitShortcodeArgs(args);
  const text = parts[0] ?? '';
  const level = parts[1] ?? 'h2';
  const hashes = '#'.repeat(parseInt(level[1], 10) || 2);
  return `${hashes} ${text}`;
}

/**
 * Convert {% slugifiedLink "Text" %} → [Text](#text)
 * Generates an anchor that matches GitHub-style slugification.
 */
function convertSlugifiedLink(args) {
  const parts = splitShortcodeArgs(args);
  const text = parts[0] ?? '';
  const anchor = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `[${text}](#${anchor})`;
}

/**
 * Convert {% image "file.ext", "alt"[, "class"] %}
 * Returns an object with the converted tag and image info.
 */
function convertImage(args, imgVarCounter, slug) {
  const parts = splitShortcodeArgs(args);
  const filename = parts[0] ?? '';
  const alt = parts[1] ?? '';
  const className = parts[2] ?? null;

  if (filename.toLowerCase().endsWith('.gif')) {
    // GIF — use plain <img> tag pointing to public/
    const src = gifSrcPath(filename, slug);
    const classAttr = className ? ` class="${className}"` : '';
    return {
      tag: `<img src="${src}" alt="${alt}"${classAttr} />`,
      isGif: true,
      filename,
      importLine: null,
      varName: null,
    };
  }

  const { varName, importLine } = nonGifImageInfo(filename, imgVarCounter, slug);
  const classAttr = className ? ` class="${className}"` : '';
  return {
    tag: `<BlogImage src={${varName}} alt="${alt}"${classAttr} />`,
    isGif: false,
    filename,
    importLine,
    varName,
  };
}

/**
 * Convert {% video "file.webm"[, autoplay][, styleArg] %}
 * 3rd arg (style string) is dropped.
 */
function convertVideo(args) {
  const parts = splitShortcodeArgs(args);
  const filename = parts[0] ?? '';
  const autoplayRaw = parts[1];
  // If autoplay is 'true' (string) or missing/false → determine flag
  const autoplay =
    autoplayRaw === undefined || autoplayRaw === '' || autoplayRaw === 'false'
      ? false
      : autoplayRaw === 'true'
      ? true
      : false;
  const src = `/videos/${filename}`;
  if (autoplay) {
    return `<VideoPlayer src="${src}" autoplay />`;
  }
  return `<VideoPlayer src="${src}" />`;
}

/**
 * Convert {% playgroundLink "url" %}
 */
function convertPlaygroundLink(args) {
  const parts = splitShortcodeArgs(args);
  const href = parts[0] ?? '';
  return `<PlaygroundLink href="${href}" />`;
}

/**
 * Split shortcode args string by commas respecting quoted strings.
 * e.g. `"hello, world", "h2", "Custom"` → ['hello, world', 'h2', 'Custom']
 */
function splitShortcodeArgs(argsStr) {
  const results = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';
  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if (!inQuote && (ch === '"' || ch === "'")) {
      inQuote = true;
      quoteChar = ch;
    } else if (inQuote && ch === quoteChar) {
      inQuote = false;
    } else if (!inQuote && ch === ',') {
      results.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) results.push(current.trim());
  return results;
}

// ---------------------------------------------------------------------------
// Main body transformer
// ---------------------------------------------------------------------------
function transformBody(body, slug) {
  const imports = new Set(); // import lines to add
  const usedComponents = new Set(); // component names used
  let imgVarCounter = 0;

  // Collect GIF files (need to copy to public/)
  const gifFiles = new Set();
  // Collect non-GIF image files (need to copy to content/blog/<slug>/)
  const imageFiles = new Set();

  // We process the body in a single pass using regex replacements.
  // Order matters: handle multi-line tags first (callout blocks).

  // 1. {% callout %}...{% endcallout %}  (multi-line)
  body = body.replace(
    /\{%[-\s]*callout[-\s]*%\}([\s\S]*?)\{%[-\s]*endcallout[-\s]*%\}/g,
    (match, inner) => {
      usedComponents.add('Callout');
      return `<Callout>\n${inner.trim()}\n</Callout>`;
    }
  );

  // 2. {% headingWithLink ... %}  (single-line)
  body = body.replace(/\{%[-\s]*headingWithLink\s+(.*?)[-\s]*%\}/g, (match, args) => {
    return convertHeadingWithLink(args.trim());
  });

  // 3. {% slugifiedLink ... %}  (single-line)
  body = body.replace(/\{%[-\s]*slugifiedLink\s+(.*?)[-\s]*%\}/g, (match, args) => {
    return convertSlugifiedLink(args.trim());
  });

  // 4. {% image ... %}  (single-line)
  body = body.replace(/\{%[-\s]*image\s+(.*?)[-\s]*%\}/g, (match, args) => {
    imgVarCounter++;
    const info = convertImage(args.trim(), imgVarCounter, slug);
    if (info.isGif) {
      gifFiles.add(info.filename);
    } else {
      imageFiles.add(info.filename);
      imports.add(info.importLine);
      usedComponents.add('BlogImage');
    }
    return info.tag;
  });

  // 5. {% video ... %}  (single-line)
  body = body.replace(/\{%[-\s]*video\s+(.*?)[-\s]*%\}/g, (match, args) => {
    usedComponents.add('VideoPlayer');
    return convertVideo(args.trim());
  });

  // 6. {% playgroundLink ... %}  (single-line)
  body = body.replace(/\{%[-\s]*playgroundLink\s+(.*?)[-\s]*%\}/g, (match, args) => {
    usedComponents.add('PlaygroundLink');
    return convertPlaygroundLink(args.trim());
  });

  // Build import block
  const componentImports = [];
  if (usedComponents.has('Callout')) {
    componentImports.push("import Callout from '@/components/mdx/Callout.astro';");
  }
  if (usedComponents.has('BlogImage')) {
    componentImports.push("import BlogImage from '@/components/mdx/BlogImage.astro';");
  }
  if (usedComponents.has('VideoPlayer')) {
    componentImports.push("import VideoPlayer from '@/components/mdx/VideoPlayer.astro';");
  }
  if (usedComponents.has('PlaygroundLink')) {
    componentImports.push("import PlaygroundLink from '@/components/mdx/PlaygroundLink.astro';");
  }

  // Combine component imports + image imports
  const allImports = [...componentImports, ...[...imports]].join('\n');

  return { body, imports: allImports, imageFiles, gifFiles };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node website-astro/scripts/migrate-post.mjs <slug>');
    console.error('Example: node website-astro/scripts/migrate-post.mjs when-should-you-memoize-in-react');
    process.exit(1);
  }

  const srcFile = path.join(SRC_BLOG, `${slug}.md`);
  if (!fs.existsSync(srcFile)) {
    console.error(`Source file not found: ${srcFile}`);
    process.exit(1);
  }

  console.log(`Migrating: ${slug}`);

  // Read source
  const raw = fs.readFileSync(srcFile, 'utf-8');

  // Split frontmatter + body
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.error('Could not parse frontmatter');
    process.exit(1);
  }

  const fmRaw = fmMatch[1];
  const bodyRaw = fmMatch[2];

  // Parse frontmatter
  const fm = parseFrontmatter(fmRaw);

  // Build new frontmatter (drop permalink, templateEngineOverride, author, thumbnail, views, featured)
  const newFm = buildFrontmatter(fm);

  // Transform body
  const { body, imports, imageFiles, gifFiles } = transformBody(bodyRaw, slug);

  // Assemble MDX content
  let mdx = newFm + '\n';
  if (imports) {
    mdx += imports + '\n';
  }
  mdx += '\n' + body;

  // Create output directory
  const outDir = path.join(ASTRO_CONTENT_BLOG, slug);
  fs.mkdirSync(outDir, { recursive: true });

  // Write MDX file
  const outFile = path.join(outDir, 'index.mdx');
  fs.writeFileSync(outFile, mdx, 'utf-8');
  console.log(`  ✓ Written: ${path.relative(REPO_ROOT, outFile)}`);

  // Copy non-GIF images to content/blog/<slug>/
  for (const filename of imageFiles) {
    const srcImg = path.join(SRC_IMG, filename);
    const destImg = path.join(outDir, filename);
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, destImg);
      console.log(`  ✓ Copied image: ${filename}`);
    } else {
      console.warn(`  ⚠ Image not found: ${srcImg}`);
    }
  }

  // Copy GIF images to public/images/<slug>/
  if (gifFiles.size > 0) {
    const gifDir = path.join(ASTRO_PUBLIC_IMAGES, slug);
    fs.mkdirSync(gifDir, { recursive: true });
    for (const filename of gifFiles) {
      const srcImg = path.join(SRC_IMG, filename);
      const destImg = path.join(gifDir, filename);
      if (fs.existsSync(srcImg)) {
        fs.copyFileSync(srcImg, destImg);
        console.log(`  ✓ Copied GIF: public/images/${slug}/${filename}`);
      } else {
        console.warn(`  ⚠ GIF not found: ${srcImg}`);
      }
    }
  }

  console.log(`Done: ${slug}`);
}

main();
