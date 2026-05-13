import nextConfig from "eslint-config-next";

// eslint-plugin-react@7.x crashes with ESLint 10 (getFilename removed).
// Use only the TypeScript and ignores configs until eslint-plugin-react@8 ships.
const [, typescriptConfig, ignoresConfig] = nextConfig;

export default [typescriptConfig, ignoresConfig];
