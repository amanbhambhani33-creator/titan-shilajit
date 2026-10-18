/**
 * Hostinger Node.js Application Startup File
 *
 * Forwards execution to the compiled production bundle in dist/server.cjs.
 * You can set the "Application startup file" in Hostinger hPanel or PM2 to either:
 *   - dist/server.cjs (Direct compiled bundle)
 *   - server.js       (This universal bridge)
 */
import './dist/server.cjs';
