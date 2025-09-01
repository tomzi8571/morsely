// scripts/set-version-env.cjs
const fs = require('fs');
const {execSync} = require('child_process');
const pkg = require('../package.json');

// Set version as year.month.n
const now = new Date();
const year = now.getFullYear() % 100; // last two digits
const month = now.getMonth() + 1; // 1-based month

// Use n as patch, auto-incremented
let n = 0;
if (pkg.version) {
    const parts = pkg.version.split('.').map(Number);
    if (parts.length === 3 && parts[0] === year && parts[1] === month) {
        n = parts[2] + 1;
    }
}
const newVersion = `${year}.${month}.${n}`;
pkg.version = newVersion;
fs.writeFileSync(__dirname + '/../package.json', JSON.stringify(pkg, null, 2) + '\n');

let commit;
try {
    commit = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
    commit = 'unknown';
}
const date = now.toISOString();

const envContent = `
VITE_APP_VERSION=${newVersion}
VITE_APP_COMMIT=${commit}
VITE_APP_BUILDTIME=${date}
`;

fs.writeFileSync(__dirname + '/../.env', envContent);
console.log(`Version set to ${newVersion} and written to .env in project root`);
