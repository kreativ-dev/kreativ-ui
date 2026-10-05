import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");

const PRIVATE_PATTERNS = [
  /^merge/i,
  /^resolve/i,
  /^validate/i,
  /^default/i,

  /\.context\./i,
  /\.styles\./i,
  /\.constants\./i,
  /\.icons\./i,
  /\.core\./i,
];

const PRIVATE_DIRECTORIES = ["defaults"];

const PUBLIC_ROOTS = ["src/index.ts"];

const INDEX_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx"];

function getAllIndexFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllIndexFiles(fullPath));
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.startsWith("index.") &&
      INDEX_EXTENSIONS.includes(path.extname(entry.name))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function isPrivatePath(filePath) {
  const relative = path.relative(ROOT, filePath);
  const parts = relative.split(path.sep);

  if (parts.some((part) => PRIVATE_DIRECTORIES.includes(part))) {
    return true;
  }

  return PRIVATE_PATTERNS.some((pattern) =>
    pattern.test(path.basename(filePath)),
  );
}

function resolveRelativeImport(indexFile, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = path.resolve(path.dirname(indexFile), specifier);

  const candidates = [
    base,
    ...INDEX_EXTENSIONS.map((ext) => `${base}${ext}`),
    ...INDEX_EXTENSIONS.map((ext) => path.join(base, `index${ext}`)),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function getExportStatements(content) {
  return [
    ...content.matchAll(
      /export\s+(?:type\s+)?(?:\*\s+from\s+)?["']([^"']+)["']/g,
    ),
  ].map((match) => match[1]);
}

function getExportNames(content) {
  const names = [];

  // export { Button, Input }
  for (const match of content.matchAll(
    /export\s*\{([\s\S]*?)\}(?:\s*from\s*["'][^"']+["'])?/g,
  )) {
    const body = match[1];

    for (const item of body.split(",")) {
      const name = item
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)[0]
        .trim();

      if (name) names.push(name);
    }
  }

  // export * from "./..."
  for (const match of content.matchAll(
    /export\s+\*\s+from\s+["']([^"']+)["']/g,
  )) {
    names.push(`* from "${match[1]}"`);
  }

  return names;
}

function formatPath(filePath) {
  return path.relative(process.cwd(), filePath).replaceAll("\\", "/");
}

const indexFiles = getAllIndexFiles(ROOT);

let warnings = 0;

console.log("\n🔍 Checking package exports...\n");

for (const indexFile of indexFiles) {
  const content = fs.readFileSync(indexFile, "utf8");

  const relativeIndex = path.relative(process.cwd(), indexFile);

  console.log(`📦 ${relativeIndex}`);

  const exportSpecifiers = getExportStatements(content);
  const exportNames = getExportNames(content);

  if (exportSpecifiers.length === 0 && exportNames.length === 0) {
    console.log("   └─ no exports\n");
    continue;
  }

  for (const specifier of exportSpecifiers) {
    const resolved = resolveRelativeImport(indexFile, specifier);

    if (!resolved) {
      continue;
    }

    const relativeTarget = formatPath(resolved);

    if (isPrivatePath(resolved)) {
      warnings++;

      console.log(`   ⚠️  private export: ${specifier}`);
      console.log(`      → ${relativeTarget}`);
    }
  }

  for (const name of exportNames) {
    console.log(`   └─ ${name}`);
  }

  console.log();
}

console.log("────────────────────────────────────");

if (warnings > 0) {
  console.log(`⚠️  Found ${warnings} potentially private export(s).`);
  console.log("   Review these before publishing the package.\n");

  process.exitCode = 1;
} else {
  console.log("✅ No potentially private exports found.\n");
}
