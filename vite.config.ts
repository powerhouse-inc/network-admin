import { getConnectBaseViteConfig } from "@powerhousedao/builder-tools";
import { defineConfig, mergeConfig, type UserConfig } from "vite";
import { existsSync } from "fs";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const baseConnectViteConfig = getConnectBaseViteConfig({
    mode,
    dirname: import.meta.dirname,
  });

  // Check if external packages have source files (for local development/linking)
  // Only include "development" condition if source files actually exist
  const projectManagementPath = resolve(
    import.meta.dirname,
    "node_modules/@powerhousedao/project-management"
  );
  const hasProjectManagementSource = existsSync(
    resolve(projectManagementPath, "index.ts")
  );

  const additionalViteConfig: UserConfig = {
    resolve: {
      // Only try "development" condition if source files exist (for locally linked packages)
      // Otherwise, skip it to avoid resolution errors and use built files
      conditions:
        mode === "development" && hasProjectManagementSource
          ? ["development", "import", "module", "browser", "default"]
          : ["import", "module", "browser", "default"],
      // In development, prioritize source TypeScript files over dist
      // In production, use dist files
      ...(mode === "development"
        ? {
            // Extensions to try when resolving imports - prioritize .ts/.tsx over .js
            // This ensures imports like "./file.js" resolve to "./file.ts" if it exists
            extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
          }
        : {
            // In production, use built files
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
          }),
    },
    // Ensure Vite processes source files directly in development
    ...(mode === "development" && {
      server: {
        // Enable HMR - let base config handle the port/host, or use defaults
        hmr: true,
        // Watch source files for changes - ensure all source directories are watched
        watch: {
          // Watch all files except node_modules and dist
          // This ensures changes to .ts/.tsx files trigger HMR
          ignored: ["**/node_modules/**", "**/dist/**"],
        },
        // Allow serving from project root
        fs: {
          // Allow serving from project root and parent directories
          allow: [".."],
        },
      },
      // Ensure Vite doesn't cache too aggressively
      optimizeDeps: {
        // Force re-optimization when dependencies change
        force: false,
        // Don't exclude anything - let Vite optimize as needed
        entries: [],
      },
      // Clear cache on startup to ensure fresh resolution
      clearScreen: false,
    }),
  };

  const config = mergeConfig(baseConnectViteConfig, additionalViteConfig);

  // In development, ensure we're using source files and HMR is working
  if (mode === "development") {
    // Log to help debug if needed
    console.log("[Vite Config] Development mode: Using source files with HMR");
  }

  return config;
});