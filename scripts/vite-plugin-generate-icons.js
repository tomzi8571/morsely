import fs from 'fs-extra';
import sharp from 'sharp';
import path from 'path';

export default function vitePluginGenerateIcons(options = {}) {
    const svgFile = options.svgFile || path.resolve('./src/assets/morsely_icon.svg');
    const svgDestPath = path.resolve('./public/morsely_icon.svg');
    const outputDir = options.outputDir || path.resolve('./public/icons');
    const manifestPath = options.manifestPath || path.resolve('./public/manifest.json');
    const sizes = options.sizes || [512, 192];
    const safeZoneRatio = options.safeZoneRatio || 0.8;

    return {
        name: 'vite-plugin-generate-icons', async buildStart() {
            await fs.ensureDir(outputDir);
            await fs.copyFile(svgFile, svgDestPath);

            const icons = [];

            for (const size of sizes) {
                const normalFileName = `morsely_icon_${size}x${size}.png`;
                const maskableFileName = `morsely_icon_${size}x${size}_maskable.png`;
                const normalFilePath = path.join(outputDir, normalFileName);
                const maskableFilePath = path.join(outputDir, maskableFileName);

                // Normal icon
                await sharp(svgFile)
                    .resize(size, size)
                    .png()
                    .toFile(normalFilePath);

                // Maskable icon with safe-zone scaling
                const innerSize = Math.floor(size * safeZoneRatio);
                const padding = Math.floor((size - innerSize) / 2);

                // Resize the SVG to the inner size first
                const resizedSVGBuffer = await sharp(svgFile)
                    .resize(innerSize, innerSize)
                    .png()
                    .toBuffer();

                // Composite the resized SVG onto a transparent canvas
                await sharp({
                    create: {
                        width: size, height: size, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0}
                    }
                })
                    .composite([{input: resizedSVGBuffer, top: padding, left: padding}])
                    .png()
                    .toFile(maskableFilePath);


                // Add to manifest
                icons.push({src: `/icons/${normalFileName}`, sizes: `${size}x${size}`, type: 'image/png'});
                icons.push({
                    src: `/icons/${maskableFileName}`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'maskable'
                });

                console.log(`Generated ${normalFileName} + ${maskableFileName}`);
            }

            // Create manifest.json
            const manifest = {
                name: "Morsely PWA",
                short_name: "Morsely",
                start_url: ".",
                display: "standalone",
                background_color: "#5B7CFF",
                theme_color: "#5B7CFF",
                icons
            };

            await fs.writeJSON(manifestPath, manifest, {spaces: 2});
            console.log(`Manifest generated at ${manifestPath}`);
        }
    };
}
