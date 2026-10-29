/* ================================================================== */
/*  GS TOP DRINKS — Image Optimization Script                          */
/*  Converte imagens para WebP/AVIF, gera srcset, blur placeholders    */
/*  Execute: node scripts/optimize-images.mjs                          */
/* ================================================================== */

import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, relative, extname, basename } from "path";
import sharp from "sharp";

const SOURCE_DIR = "imagens";
const DEST_DIR = "public/gs/images";
const MANIFEST_PATH = "public/gs/images/manifest.json";

const WIDTHS = [400, 800, 1200, 1600];
const QUALITY = 82;
const BLUR_WIDTH = 20;

const DRINK_IMAGE_MAP = {
  "CAIPIRINHA MARACUJA E LIMAO.jpg": "caipirinha-maracuja-limao",
  "CAIPIRINHA MORANGO.jpg": "caipirinha-morango",
  "COQUETEL COLORIDO.jpg": "coquetel-colorido",
  "COQUETEL MARTINI LIMAO.jpg": "coquetel-martini-limao",
  "COQUETEL TROPICAL.jpg": "coquetel-tropical",
  "DRINK LARANJA ALECRIM.jpg": "drink-laranja-alecrim",
  "MOSCOWMULE.jpg": "moscow-mule",
  "FOTODONO1.jpg": "gilmar-1",
  "FOTODONO2.jpg": "gilmar-2",
  "DONO-SITE.png": "gilmar-site",
  "CAPA SITE ATUAL.png": "hero-capa",
  "INSTA ATUAL.png": "insta-atual",
  "dados3.png": "dados-3",
  "MAIS.DADOS.png": "mais-dados-1",
  "MAIS.DADOS2.png": "mais-dados-2",
  "seg-aniversario.jpg": "segment-aniversario",
  "seg-casamento.jpg": "segment-casamento",
  "seg-corporativo.jpg": "segment-corporativo",
  "hero.jpg": "hero-main",
  "lineup.jpg": "lineup",
  "wedding.jpg": "wedding",
  "gallery-1.jpg": "gallery-1",
  "gallery-2.jpg": "gallery-2",
  "gallery-3.jpg": "gallery-3",
  "gallery-4.jpg": "gallery-4",
  "gallery-5.jpg": "gallery-5",
  "gallery-6.jpg": "gallery-6",
  "gallery-7.jpg": "gallery-7",
  "gilmar-1.jpg": "gilmar-1",
  "gilmar-2.jpg": "gilmar-2",
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function processImage(sourcePath, destName, subDir) {
  const destDir = join(DEST_DIR, subDir);
  ensureDir(destDir);

  const metadata = await sharp(sourcePath).metadata();
  const isPng = extname(sourcePath).toLowerCase() === ".png";
  const isLarge = (metadata.width ?? 0) > 1600 || (metadata.height ?? 0) > 1600;

  const results = {
    original: basename(sourcePath),
    slug: destName,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    webp: [],
    avif: [],
    fallback: { path: "", size: 0 },
    blurPlaceholder: "",
    alt: destName.replace(/-/g, " "),
    subDir,
  };

  // Generate WebP versions
  for (const w of WIDTHS) {
    if (w > (metadata.width ?? 0)) continue;
    const outPath = join(destDir, `${destName}-${w}w.webp`);
    await sharp(sourcePath)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outPath);
    const stats = statSync(outPath);
    results.webp.push({ width: w, path: `/gs/images/${subDir}/${destName}-${w}w.webp`, size: stats.size });
  }

  // Generate AVIF versions (smaller but slower)
  for (const w of [800, 1200]) {
    if (w > (metadata.width ?? 0)) continue;
    const outPath = join(destDir, `${destName}-${w}w.avif`);
    await sharp(sourcePath)
      .resize(w, null, { withoutEnlargement: true })
      .avif({ quality: 50, effort: 9 })
      .toFile(outPath);
    const stats = statSync(outPath);
    results.avif.push({ width: w, path: `/gs/images/${subDir}/${destName}-${w}w.avif`, size: stats.size });
  }

  // Fallback JPEG (original size, optimized)
  const fallbackPath = join(destDir, `${destName}.jpg`);
  await sharp(sourcePath)
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(fallbackPath);
  const fallbackStats = statSync(fallbackPath);
  results.fallback = { path: `/gs/images/${subDir}/${destName}.jpg`, size: fallbackStats.size };

  // Blur placeholder (base64)
  const blurBuffer = await sharp(sourcePath)
    .resize(BLUR_WIDTH, null, { withoutEnlargement: true })
    .blur(10)
    .jpeg({ quality: 20 })
    .toBuffer();
  results.blurPlaceholder = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;

  console.log(`✓ ${destName} (${subDir}) - ${results.webp.length} WebP, ${results.avif.length} AVIF, blur: ${results.blurPlaceholder.length} chars`);
  return results;
}

async function main() {
  console.log("🚀 Iniciando otimização de imagens...\n");

  ensureDir(DEST_DIR);
  ensureDir(join(DEST_DIR, "drinks"));
  ensureDir(join(DEST_DIR, "segments"));
  ensureDir(join(DEST_DIR, "team"));
  ensureDir(join(DEST_DIR, "gallery"));
  ensureDir(join(DEST_DIR, "packages"));

  const manifest = {
    version: "1.0",
    generated: new Date().toISOString(),
    images: {},
  };

  // Process source images from imagens/
  const sourceFiles = readdirSync(SOURCE_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  for (const file of sourceFiles) {
    const sourcePath = join(SOURCE_DIR, file);
    const mappedName = DRINK_IMAGE_MAP[file] || slugify(basename(file, extname(file)));
    
    let subDir = "gallery";
    if (file.includes("CAIPIRINHA") || file.includes("COQUETEL") || file.includes("DRINK") || file.includes("MOSCOW") || file.includes("MULE")) {
      subDir = "drinks";
    } else if (file.includes("FOTODONO") || file.includes("DONO-SITE") || file.includes("gilmar")) {
      subDir = "team";
    } else if (file.includes("CAPA") || file.includes("hero")) {
      subDir = "segments";
    } else if (file.includes("seg-")) {
      subDir = "segments";
    }

    try {
      const result = await processImage(sourcePath, mappedName, subDir);
      manifest.images[mappedName] = result;
    } catch (err) {
      console.error(`✗ Erro processando ${file}:`, err);
    }
  }

  // Also process existing public/gs and public/img
  const existingDirs = [
    { src: "public/gs", dest: "gallery" },
    { src: "public/img", dest: "segments" },
  ];

  for (const { src, dest } of existingDirs) {
    if (!existsSync(src)) continue;
    const files = readdirSync(src).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    for (const file of files) {
      const sourcePath = join(src, file);
      const mappedName = DRINK_IMAGE_MAP[file] || slugify(basename(file, extname(file)));
      try {
        const result = await processImage(sourcePath, mappedName, dest);
        manifest.images[mappedName] = result;
      } catch (err) {
        console.error(`✗ Erro processando ${src}/${file}:`, err);
      }
    }
  }

  // Write manifest
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Manifesto salvo em ${MANIFEST_PATH}`);
  console.log(`📊 Total de imagens processadas: ${Object.keys(manifest.images).length}`);
}

main().catch(console.error);