const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '../build/contracts');
const destPath = path.join(__dirname, '../client/src/contracts');

// Ensure the destination directory exists
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}

// Copy all contract artifacts
fs.readdirSync(buildPath).forEach(file => {
  const srcFile = path.join(buildPath, file);
  const destFile = path.join(destPath, file);
  fs.copyFileSync(srcFile, destFile);
  console.log(`Copied ${file} to client/src/contracts`);
});

console.log('All contract artifacts copied successfully!');