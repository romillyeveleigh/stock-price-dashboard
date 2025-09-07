#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle size thresholds (in KB)
const THRESHOLDS = {
  maxChunkSize: 500,
  maxTotalSize: 1300,
  warningChunkSize: 450,
  warningTotalSize: 1200,
};

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024); // Convert to KB
  } catch (error) {
    return 0;
  }
}

function analyzeBundleSize() {
  const distDir = path.join(__dirname, '../dist/assets');

  if (!fs.existsSync(distDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  const files = fs.readdirSync(distDir);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  const cssFiles = files.filter(file => file.endsWith('.css'));

  let totalSize = 0;
  let largestChunk = { name: '', size: 0 };

  console.log('\n📊 Bundle Size Analysis\n');
  console.log('JavaScript Chunks:');

  jsFiles.forEach(file => {
    const size = getFileSize(path.join(distDir, file));
    totalSize += size;

    if (size > largestChunk.size) {
      largestChunk = { name: file, size };
    }

    const status =
      size > THRESHOLDS.maxChunkSize
        ? '❌'
        : size > THRESHOLDS.warningChunkSize
          ? '⚠️'
          : '✅';

    console.log(`  ${status} ${file}: ${size} KB`);
  });

  console.log('\nCSS Files:');
  cssFiles.forEach(file => {
    const size = getFileSize(path.join(distDir, file));
    totalSize += size;
    console.log(`  ✅ ${file}: ${size} KB`);
  });

  console.log(`\n📈 Summary:`);
  console.log(`  Total Size: ${totalSize} KB`);
  console.log(
    `  Largest Chunk: ${largestChunk.name} (${largestChunk.size} KB)`
  );

  // Check thresholds
  let hasErrors = false;

  if (largestChunk.size > THRESHOLDS.maxChunkSize) {
    console.log(
      `\n❌ ERROR: Largest chunk (${largestChunk.size} KB) exceeds maximum threshold (${THRESHOLDS.maxChunkSize} KB)`
    );
    hasErrors = true;
  }

  if (totalSize > THRESHOLDS.maxTotalSize) {
    console.log(
      `\n❌ ERROR: Total bundle size (${totalSize} KB) exceeds maximum threshold (${THRESHOLDS.maxTotalSize} KB)`
    );
    hasErrors = true;
  }

  if (
    largestChunk.size > THRESHOLDS.warningChunkSize &&
    largestChunk.size <= THRESHOLDS.maxChunkSize
  ) {
    console.log(
      `\n⚠️  WARNING: Largest chunk (${largestChunk.size} KB) exceeds warning threshold (${THRESHOLDS.warningChunkSize} KB)`
    );
  }

  if (
    totalSize > THRESHOLDS.warningTotalSize &&
    totalSize <= THRESHOLDS.maxTotalSize
  ) {
    console.log(
      `\n⚠️  WARNING: Total bundle size (${totalSize} KB) exceeds warning threshold (${THRESHOLDS.warningTotalSize} KB)`
    );
  }

  if (
    !hasErrors &&
    largestChunk.size <= THRESHOLDS.warningChunkSize &&
    totalSize <= THRESHOLDS.warningTotalSize
  ) {
    console.log(`\n✅ All bundle sizes are within acceptable limits!`);
  }

  console.log('\n');

  if (hasErrors) {
    process.exit(1);
  }
}

analyzeBundleSize();
