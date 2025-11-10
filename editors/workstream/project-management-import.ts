// Re-export ScopeOfWork to work around broken package.json exports
// The package has a "development" condition pointing to non-existent source files
// Using a symlink to the dist folder that Vite can resolve
import { module as ScopeOfWork } from "./scope-of-work-link/index.js";
export { ScopeOfWork };

