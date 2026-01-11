/**
 * Icon Conversion Script
 *
 * This script helps convert your light/dark icon folders into a single set
 * with currentColor that adapts to themes automatically.
 *
 * Usage:
 *   node scripts/convert-icons.js <source-folder> <output-folder>
 *
 * Example:
 *   node scripts/convert-icons.js ./icons/light ./public/icons
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertSvgToCurrentColor(svgContent) {
    let converted = svgContent;

    // Replace fill colors (but keep fill="none")
    converted = converted.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"');
    converted = converted.replace(/fill='(?!none)[^']*'/g, "fill='currentColor'");

    // Replace stroke colors (but keep stroke="none")
    converted = converted.replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
    converted = converted.replace(/stroke='(?!none)[^']*'/g, "stroke='currentColor'");

    // Remove style attributes with hardcoded colors
    converted = converted.replace(/style="[^"]*fill:[^;"]*/g, 'style="fill:currentColor');
    converted = converted.replace(/style="[^"]*stroke:[^;"]*/g, 'style="stroke:currentColor');

    return converted;
}

function processDirectory(sourceDir, outputDir) {
    if (!fs.existsSync(sourceDir)) {
        console.error(`Source directory not found: ${sourceDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir);
    let processedCount = 0;

    files.forEach(file => {
        if (file.endsWith('.svg')) {
            const sourcePath = path.join(sourceDir, file);
            const outputPath = path.join(outputDir, file);

            try {
                const svgContent = fs.readFileSync(sourcePath, 'utf8');
                const convertedSvg = convertSvgToCurrentColor(svgContent);
                fs.writeFileSync(outputPath, convertedSvg, 'utf8');
                processedCount++;
                console.log(`✓ Converted: ${file}`);
            } catch (error) {
                console.error(`✗ Error processing ${file}:`, error.message);
            }
        }
    });

    console.log(`\n✨ Successfully converted ${processedCount} icons!`);
    console.log(`📁 Output directory: ${outputDir}`);
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node scripts/convert-icons.js <source-folder> <output-folder>');
    console.log('Example: node scripts/convert-icons.js ./icons/light ./public/icons');
    process.exit(1);
}

const sourceDir = path.resolve(args[0]);
const outputDir = path.resolve(args[1]);

processDirectory(sourceDir, outputDir);
