import { dirname, resolve} from 'node:path'
import { fileURLToPath} from 'node:url'
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readdirSync, copyFileSync, mkdirSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url))

// Recursive directory copy function
function copyDirRecursive(src: string, dest: string) {
  mkdirSync(dest, { recursive: true });
  readdirSync(src).forEach(file => {
    const srcFile = resolve(src, file);
    const destFile = resolve(dest, file);
    const stat = statSync(srcFile);
    if (stat.isDirectory()) {
      copyDirRecursive(srcFile, destFile);
    } else {
      copyFileSync(srcFile, destFile);
    }
  });
}

// Plugin to copy background scripts, locales, and manifest to dist
function copyExtensionFilesPlugin(): Plugin {
  return {
    name: 'copy-extension-files',
    apply: 'build',
    writeBundle() {
      const srcDir = resolve(__dirname, 'src');
      const distDir = resolve(__dirname, 'dist');

      // Copy background scripts
      const bgScriptsDir = resolve(srcDir, 'background_scripts');
      const distBgScriptsDir = resolve(distDir, 'background_scripts');
      mkdirSync(distBgScriptsDir, { recursive: true });
      readdirSync(bgScriptsDir).forEach(file => {
        if (file.endsWith('.js')) {
          copyFileSync(
            resolve(bgScriptsDir, file),
            resolve(distBgScriptsDir, file)
          );
        }
      });

      // Copy manifest.json
      copyFileSync(
        resolve(srcDir, 'manifest.json'),
        resolve(distDir, 'manifest.json')
      );

      // Copy _locales directory
      const localesDir = resolve(srcDir, '_locales');
      const distLocalesDir = resolve(distDir, '_locales');
      try {
        const stat = statSync(localesDir);
        if (stat.isDirectory()) {
          copyDirRecursive(localesDir, distLocalesDir);
        }
      } catch {
        // Directory doesn't exist yet, skip
      }
    }
  };
}

export default defineConfig(({ mode }) => ({
  root: "src",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), copyExtensionFilesPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        demo: resolve(__dirname, 'src/index.html'),
        popup: resolve (__dirname , 'src/pages/popup/index.html'),
        settings: resolve (__dirname , 'src/pages/settings/index.html'),
        timeout: resolve (__dirname , 'src/pages/timeout/index.html')
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
}));
