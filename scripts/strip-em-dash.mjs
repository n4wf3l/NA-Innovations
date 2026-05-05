import { readFileSync, writeFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const EXCLUDE_DIRS = new Set([
    'node_modules', 'vendor', 'public', 'storage',
    '.git', '.idea', '.vscode',
]);
const EXCLUDE_FILES = new Set([
    'snapshot.json',
    'composer.lock',
    'package-lock.json',
]);
const INCLUDE_EXTS = new Set([
    '.tsx', '.ts', '.jsx', '.js',
    '.php', '.blade.php',
    '.json', '.md',
    '.css', '.scss',
    '.html',
]);

let touched = 0;
let totalReplacements = 0;
const filesChanged = [];

function shouldProcess(path) {
    const name = path.split(/[\\/]/).pop();
    if (EXCLUDE_FILES.has(name)) return false;
    if (path.includes('public/build') || path.includes('public\\build')) return false;
    if (path.includes('database/seeders/snapshot') || path.includes('database\\seeders\\snapshot')) return false;
    // Match by extension. .blade.php has 2 dots, treat specially.
    if (name.endsWith('.blade.php')) return true;
    const dot = name.lastIndexOf('.');
    if (dot < 0) return false;
    return INCLUDE_EXTS.has(name.slice(dot));
}

function walk(dir) {
    let entries;
    try { entries = readdirSync(dir); } catch { return; }
    for (const entry of entries) {
        if (EXCLUDE_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        let st;
        try { st = statSync(full); } catch { continue; }
        if (st.isDirectory()) {
            walk(full);
        } else if (st.isFile() && shouldProcess(full)) {
            processFile(full);
        }
    }
}

function processFile(path) {
    const before = readFileSync(path, 'utf8');
    if (!before.includes('—')) return;
    // Replace " — " (space em-dash space) with " - "
    // Replace "—" without surrounding space with "-"
    const after = before
        .replace(/ — /g, ' - ')
        .replace(/—/g, '-');
    if (after !== before) {
        const count = (before.match(/—/g) || []).length;
        writeFileSync(path, after, 'utf8');
        touched++;
        totalReplacements += count;
        filesChanged.push({ path, count });
    }
}

walk('.');

console.log(`Files touched: ${touched}`);
console.log(`Total replacements: ${totalReplacements}`);
console.log('---');
filesChanged
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .forEach(f => console.log(`  ${f.count.toString().padStart(4)}  ${f.path}`));
